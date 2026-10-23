"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Config } from "../types";

export interface PreviewItem {
  id: string;
  name: string | null;
  image_url: string | null;
  weight: number;
}

export const TILE_SIZE = 80;
const TILE_STEP = TILE_SIZE + 8;
const SHUFFLE_DELAYS = [70, 70, 70, 80, 90, 100, 120, 150, 190, 240, 300, 380];
export const DECELERATION = "cubic-bezier(0.12, 0.7, 0.2, 1)";
export const SPIN_DURATION_MS = 3200;

/** Client-only rehearsal of the OBS animation. It never touches the server. */
export function usePreviewSpin(
  items: PreviewItem[],
  visualization: Config["visualization"],
  stageWidth: number,
) {
  const count = items.length;
  const [shownIndex, setShownIndex] = useState(0);
  const [resultIndex, setResultIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [slide, setSlide] = useState<{ tile: number | null; animate: boolean }>(
    {
      tile: null,
      animate: false,
    },
  );
  const [wheel, setWheel] = useState({ degrees: 0, animate: false });
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((callback: () => void, delay: number) => {
    timers.current.push(setTimeout(callback, delay));
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const safeResult = Math.min(resultIndex, Math.max(count - 1, 0));
  const safeShown = Math.min(shownIndex, Math.max(count - 1, 0));

  function pickWeighted() {
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    let remaining = Math.random() * total;
    for (let index = 0; index < items.length; index += 1) {
      if (remaining < items[index].weight) return index;
      remaining -= items[index].weight;
    }
    return items.length - 1;
  }

  function spin() {
    if (spinning || count === 0) return;
    setSpinning(true);

    if (visualization === "SHUFFLE") {
      const target = Math.floor(Math.random() * count);
      let step = 0;
      let current = safeShown;
      const tick = () => {
        if (step >= SHUFFLE_DELAYS.length) {
          setShownIndex(target);
          setResultIndex(target);
          setSpinning(false);
          return;
        }
        current =
          (current + 1 + Math.floor(Math.random() * Math.max(1, count - 1))) %
          count;
        setShownIndex(current);
        later(tick, SHUFFLE_DELAYS[step]);
        step += 1;
      };
      tick();
      return;
    }

    if (visualization === "SLIDE") {
      const target = Math.floor(Math.random() * count);
      setSlide({ tile: count + safeResult, animate: false });
      later(() => setSlide({ tile: 2 * count + target, animate: true }), 40);
      later(() => {
        setSlide({ tile: null, animate: false });
        setResultIndex(target);
        setShownIndex(target);
        setSpinning(false);
      }, SPIN_DURATION_MS + 100);
      return;
    }

    const target = pickWeighted();
    const total = items.reduce((sum, item) => sum + item.weight, 0);
    const start = items
      .slice(0, target)
      .reduce((sum, item) => sum + (item.weight / total) * 360, 0);
    const middle = start + ((items[target].weight / total) * 360) / 2;
    setWheel((previous) => ({
      animate: true,
      degrees:
        (Math.floor(previous.degrees / 360) + 5) * 360 + ((360 - middle) % 360),
    }));
    later(() => {
      setResultIndex(target);
      setShownIndex(target);
      setSpinning(false);
    }, SPIN_DURATION_MS + 200);
  }

  const center = stageWidth / 2 - TILE_SIZE / 2;
  const slideOffset = center - TILE_STEP * (slide.tile ?? count + safeResult);

  return {
    spinning,
    spin,
    shownIndex: safeShown,
    resultIndex: safeResult,
    slideOffset,
    slideAnimate: slide.animate,
    wheelDegrees: wheel.degrees,
    wheelAnimate: wheel.animate,
  };
}

export function wheelSlices(weights: number[], radius = 72, center = 80) {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const point = (degrees: number) => {
    const radians = (degrees * Math.PI) / 180;
    return [
      center + radius * Math.sin(radians),
      center - radius * Math.cos(radians),
    ];
  };
  let accumulated = 0;
  return weights.map((weight) => {
    const from = accumulated;
    const to = accumulated + (total > 0 ? (weight / total) * 360 : 0);
    accumulated = to;
    const [startX, startY] = point(from);
    const [endX, endY] = point(to - 0.01);
    const large = to - from > 180 ? 1 : 0;
    return `M${center} ${center} L${startX.toFixed(2)} ${startY.toFixed(2)} A${radius} ${radius} 0 ${large} 1 ${endX.toFixed(2)} ${endY.toFixed(2)} Z`;
  });
}

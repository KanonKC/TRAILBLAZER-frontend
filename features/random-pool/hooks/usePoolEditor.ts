"use client";

import { useState } from "react";
import { PoolDraft, PoolItem } from "../types";

const emptyItem = (): PoolItem => ({
  name: "",
  image_key: null,
  image_url: null,
});

export function usePoolEditor(
  value: PoolDraft,
  onChange: (pool: PoolDraft) => void,
) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [itemDraft, setItemDraft] = useState<PoolItem>(emptyItem);
  const [fileError, setFileError] = useState("");

  function startAdd() {
    setEditingIndex(-1);
    setItemDraft(emptyItem());
    setFileError("");
  }

  function startEdit(index: number) {
    setEditingIndex(index);
    setItemDraft({ ...value.items[index] });
    setFileError("");
  }

  function cancel() {
    setEditingIndex(null);
    setFileError("");
  }

  function saveItem() {
    if (!itemDraft.name?.trim() && !itemDraft.image_key) return;
    const items = [...value.items];
    const normalized = { ...itemDraft, name: itemDraft.name?.trim() || null };
    if (editingIndex === -1) items.push(normalized);
    else if (editingIndex !== null) items[editingIndex] = normalized;
    onChange({ ...value, items });
    cancel();
  }

  function deleteItem(index: number) {
    onChange({
      ...value,
      items: value.items.filter((_, itemIndex) => itemIndex !== index),
    });
    if (editingIndex === index) cancel();
  }

  function validateImage(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      setFileError(
        `ไฟล์ใหญ่เกิน 2 MB (${(file.size / 1024 / 1024).toFixed(1)} MB) กรุณาเลือกรูปใหม่`,
      );
      return false;
    }
    setFileError("");
    return true;
  }

  return {
    editingIndex,
    itemDraft,
    setItemDraft,
    fileError,
    startAdd,
    startEdit,
    cancel,
    saveItem,
    deleteItem,
    validateImage,
    setFileError,
  };
}

## TRAILBLAZER conventions (read before building)

TRAILBLAZER is a Thai-language Twitch streamer toolkit: a **dark UI only** (near-black `#070a14` surfaces, orange `#FF8C00` primary, gold `#FFD700` accent), Anuphan body text, Kanit display text. It is shadcn/ui + Tailwind v4, with a fixed, precompiled class vocabulary.

### 1. Wrap every design in `TrailblazerTheme`

```jsx
<TrailblazerTheme className="min-h-screen">…</TrailblazerTheme>
```

It renders the `.dark` scope with `bg-background text-foreground font-sans` and puts `dark` on `<html>` (the app does the same in its root layout). Without it components render in an unused light palette, `dark:` variants are off, and portaled overlays (`Dialog`, `Select`, `DropdownMenu`, `Tooltip`, `Popover`, `Combobox`) lose their colours. Use it once, at the root. Toasts: render one `<Toaster />` at the root and fire them with `toast` / `tbToast` from this package (same sonner instance).

### 2. Styling idiom: Tailwind utilities from a fixed list

Style with `className` utilities only - no inline styles, no new CSS. `styles.css` is **precompiled**: a class that is not in it does nothing. These families are guaranteed present (numeric steps listed exactly):

| Family | Classes that exist |
|---|---|
| Layout | `flex` `inline-flex` `grid` `hidden` `flex-col` `flex-row` `flex-wrap` `flex-1` `shrink-0` `grow`; `items-*` `self-*` with `start center end stretch baseline`; `justify-*` `content-*` `place-items-*` with `start center end between around`; `grid-cols-1…6,12`, `col-span-1…4,6,full`; `sm:` `md:` `lg:` prefixes on layout/gap/grid |
| Spacing | `gap` `gap-x` `gap-y` `space-x` `space-y` `p px py pt pb pl pr m mx my mt mb ml mr` with `0 0.5 1 1.5 2 2.5 3 4 5 6 8 10 12 16` (`p/m` also `20 24`); `mx-auto` |
| Size | `w h size min-w min-h max-w max-h` with `0…12 14 16 20 24 28 32 36 40 44 48 52 56 60 64 72 80 96 full fit px` (+ `auto` `screen` on `w h min-w min-h`); `w-1/2 1/3 2/3 1/4 3/4`; `max-w-xs…7xl`; `min-h-screen`. No arbitrary `[…]` values. |
| Text | `text-xs sm base lg xl 2xl 3xl 4xl 5xl 6xl`; `font-light normal medium semibold bold extrabold`; `font-sans` (Anuphan, default) `font-kanit` (display headings, brand) `font-mono`; `leading-*` `tracking-*` `text-left/center/right` `truncate` `uppercase` `whitespace-nowrap` `line-clamp-1…3` `tabular-nums` |
| Semantic colour | `bg-` `text-` `border-` `ring-` × `background card popover muted secondary primary accent destructive foreground muted-foreground card-foreground popover-foreground primary-foreground secondary-foreground accent-foreground border input ring`; opacity suffixes `/5 /10 /20 /30 /50 /80` on `bg-`/`border-`/`text-` for `primary secondary muted accent destructive foreground card border input`; `hover:` on all of these |
| Raw colour | `bg/text/border-{orange,amber,yellow,green,emerald,red,rose,blue,sky,purple,violet,slate,gray,zinc,neutral}-50…950`; `text-white` `text-white/70` `bg-white/5` `bg-white/10` `border-white/10` `border-white/20` `bg-black/50` |
| Surface | `rounded rounded-sm md lg xl 2xl 3xl full`; `border border-t border-b border-x border-y border-dashed`; `shadow-xs sm md lg xl`; `ring-1 ring-2`; `divide-y` |
| Position/misc | `relative absolute fixed sticky inset-0 top-0 right-0 bottom-0 left-0 z-10…50`; `overflow-hidden/auto`; `opacity-*`; `transition transition-colors duration-150/200/300`; `cursor-pointer` `select-none` `sr-only`; `aspect-video aspect-square object-cover`; `animate-spin animate-pulse animate-float animate-pulse-glow animate-gradient animate-marquee` |
| Brand utilities | `trailblazer-gradient` (orange→gold fill, for icon tiles / hero blocks), `trailblazer-gradient-text` (gradient wordmark text), `glass` (translucent dark card - landing page cards), `text-discord` `bg-discord` `spotify` (brand colours) |

House style seen in the app: cards are `Card` (or `glass` on marketing pages); helper text is `text-sm text-muted-foreground` (or `SubLabel`); widget settings panels use translucent `bg-white/5 border-white/10` blocks with `text-white/70` copy; the primary button is **white** (`Button` default), orange is reserved for `Badge`, `Switch`, `Checkbox`, `Progress`, `Slider` fills and the `trailblazer-gradient`; Twitch login is `Button variant="twitch"`.

### 3. Where the truth lives

- `styles.css` → `_ds_bundle.css`: the compiled stylesheet. Tokens are the `--background --foreground --card --popover --primary --secondary --muted --accent --destructive --border --input --ring --radius` custom properties inside its `.dark { … }` block (light `:root` values exist but the product never uses them). `fonts/fonts.css` ships Anuphan 400-700 and Kanit 400/700/800 (latin + thai).
- `components/<group>/<Name>/<Name>.prompt.md` - per-component usage with real Thai copy; `<Name>.d.ts` - the exact props. Groups: `actions forms layout overlays feedback navigation data-display brand app widgets landing`.
- Sub-parts (`CardHeader`, `DialogContent`, `TableRow`, …) are separate exports; the family root's prompt shows the full composition.

### 4. Idiomatic build snippet

```jsx
import { TrailblazerTheme, Card, CardHeader, CardTitle, CardDescription, WidgetSettingsCardContent, WidgetSettingsCardFooter, Field, FieldLabel, FieldDescription, Input, MSDelaySlider, WidgetTestControl, DeleteWidgetButton, BrandLogo, Badge } from "trailblazer-ui";

<TrailblazerTheme className="min-h-screen">
  <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
    <span className="text-2xl"><BrandLogo /></span>
    <Badge>Pro</Badge>
  </header>
  <main className="max-w-2xl mx-auto p-6 grid gap-6">
    <Card>
      <CardHeader>
        <CardTitle>ตั้งค่า Clip Shoutout</CardTitle>
        <CardDescription>ปรับระยะเวลา เสียง และการหน่วงเวลา</CardDescription>
      </CardHeader>
      <WidgetSettingsCardContent>
        <Field>
          <FieldLabel htmlFor="dur">ระยะเวลาคลิป (วินาที)</FieldLabel>
          <Input id="dur" type="number" defaultValue={30} />
          <FieldDescription>คลิปจะถูกตัดเมื่อครบเวลา</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>หน่วงเวลาก่อนเล่น</FieldLabel>
          <MSDelaySlider value={2000} onChange={() => {}} />
        </Field>
      </WidgetSettingsCardContent>
      <WidgetSettingsCardFooter>
        <WidgetTestControl isSaving={false} isTesting={false} canTest onSave={() => {}} onTest={() => {}} />
        <DeleteWidgetButton onDelete={() => {}} isLoading={false} />
      </WidgetSettingsCardFooter>
    </Card>
  </main>
</TrailblazerTheme>
```

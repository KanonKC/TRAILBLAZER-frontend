---
category: Forms
---
Form layout primitives. `FieldGroup` stacks fields with 28px gaps; each `Field` (vertical by default, `orientation="horizontal"` for switch/checkbox rows) holds a `FieldLabel`, the control, a `FieldDescription`, and a `FieldError` (`errors={[{message}]}` or children). `FieldSet` + `FieldLegend` group related fields; `FieldSeparator` draws a labelled divider.

## Usage

```tsx
import { FieldGroup, FieldSet, FieldLegend, Field, FieldLabel, FieldDescription, FieldError, FieldSeparator, Input, Switch } from "trailblazer-ui";

<FieldGroup className="max-w-md">
  <FieldSet>
    <FieldLegend>การตั้งค่าคลิป</FieldLegend>
    <Field>
      <FieldLabel htmlFor="dur">ระยะเวลา (วินาที)</FieldLabel>
      <Input id="dur" type="number" defaultValue={30} />
      <FieldDescription>คลิปจะถูกตัดเมื่อครบเวลา</FieldDescription>
    </Field>
    <Field data-invalid>
      <FieldLabel htmlFor="vol">ระดับเสียง</FieldLabel>
      <Input id="vol" type="number" defaultValue={140} aria-invalid />
      <FieldError errors={[{ message: "ต้องอยู่ระหว่าง 0-100" }]} />
    </Field>
  </FieldSet>
  <FieldSeparator>ขั้นสูง</FieldSeparator>
  <Field orientation="horizontal">
    <FieldLabel htmlFor="auto">เล่นอัตโนมัติ</FieldLabel>
    <Switch id="auto" defaultChecked />
  </Field>
</FieldGroup>
```

## Parts

- `FieldGroup` - vertical stack of fields (28px gap)
- `FieldSet` - `<fieldset>` wrapper (24px gap)
- `FieldLegend` - fieldset heading (`variant="label"` for the smaller style)
- `FieldLabel` - the label (wrap a whole `Field` inside it to make a selectable card)
- `FieldTitle` - label-styled text that isn't a `<label>`
- `FieldContent` - column beside a horizontal control
- `FieldDescription` - muted helper text
- `FieldError` - red error line(s) from `errors` or children
- `FieldSeparator` - divider with optional centred text

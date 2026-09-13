---
category: Forms
---
`FieldError` is part of the **Field** family - red error line(s) from `errors` or children. Render it inside the `Field` composition; it has no standalone use.

## Usage (family composition)

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

See `Field.prompt.md` for the family overview.

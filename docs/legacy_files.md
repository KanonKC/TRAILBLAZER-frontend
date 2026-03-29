# Legacy Files for Removal

These files and directories have been replaced by the new **Feature-Based Architecture** in the `features/` directory. They are no longer in use by the main application flow and can be safely deleted.

## 📁 Services (Legacy)
These monolithic services have been split into domain-specific API files in `features/*/api/*.api.ts`.

- `services/firstWord.service.ts`
- `services/clipShoutout.service.ts`
- `services/dropImage.service.ts`
- `services/randomDbdPerk.service.ts`

## 📁 Dashboard Widgets (Legacy Components)
The UI logic and state have been migrated to Feature Hooks and View Components.

### **First Word**
- `app/dashboard/widgets/first-word/_components/FirstWordWidgetClient.tsx`
- `app/dashboard/widgets/first-word/_components/CustomReplyList.tsx`
- `app/dashboard/widgets/first-word/_components/CustomReplyForm.tsx`
- `app/dashboard/widgets/first-word/_components/GeneralSettings.tsx`
- `app/dashboard/widgets/first-word/_components/QuickStartWizard.tsx`

### **Clip Shoutout**
- `app/dashboard/widgets/clip-shoutout/_components/ClipShoutoutWidgetClient.tsx`

### **Drop Image**
- `app/dashboard/widgets/drop-image/_components/DropImageWidgetClient.tsx`

### **Random DBD Perk**
- `app/dashboard/widgets/random-dbd-perk/_components/RandomDbdPerkWidgetClient.tsx`
- `app/dashboard/widgets/random-dbd-perk/_components/PerkConfigItem.tsx`
- `app/dashboard/widgets/random-dbd-perk/_components/MaxPerkSelector.tsx`
- `app/dashboard/widgets/random-dbd-perk/_components/RandomFormatInfo.tsx`

---

> [!CAUTION]
> Before deleting, ensure that no other non-widget pages are importing from these files (though global components should have been updated). 

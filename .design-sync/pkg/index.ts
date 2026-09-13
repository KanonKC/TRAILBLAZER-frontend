// design-sync entry for the TRAILBLAZER design system.
// Curated re-exports of the real components under components/. Everything
// listed here lands on window.Trailblazer and gets a .d.ts / .prompt.md / card.
// Components that need the Next.js router, next/image, live API services, the
// auth UserProvider, or WebGL are deliberately NOT exported - see NOTES.md.

export { TrailblazerTheme } from "./theme";

// -- shadcn/ui primitives (components/ui) ----------------------------------
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/ui/accordion";
export {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogOverlay, AlertDialogPortal,
  AlertDialogTitle, AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
export { Alert, AlertTitle, AlertDescription, AlertAction } from "../../components/ui/alert";
export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge } from "../../components/ui/avatar";
export { Badge, badgeVariants } from "../../components/ui/badge";
export { Button, buttonVariants } from "../../components/ui/button";
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "../../components/ui/card";
export { Checkbox } from "../../components/ui/checkbox";
export {
  Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxGroup, ComboboxLabel,
  ComboboxCollection, ComboboxEmpty, ComboboxSeparator, ComboboxChips, ComboboxChip, ComboboxChipsInput,
  ComboboxTrigger, ComboboxValue, useComboboxAnchor,
} from "../../components/ui/combobox";
export {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay,
  DialogPortal, DialogTitle, DialogTrigger,
} from "../../components/ui/dialog";
export {
  DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from "../../components/ui/dropdown-menu";
export {
  Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSeparator, FieldSet,
  FieldContent, FieldTitle,
} from "../../components/ui/field";
export {
  InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea,
} from "../../components/ui/input-group";
export { Input } from "../../components/ui/input";
export { Label } from "../../components/ui/label";
export {
  Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger,
} from "../../components/ui/popover";
export { Progress } from "../../components/ui/progress";
export { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
export { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
export {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton,
  SelectSeparator, SelectTrigger, SelectValue,
} from "../../components/ui/select";
export { Separator } from "../../components/ui/separator";
export { Skeleton } from "../../components/ui/skeleton";
export { Slider } from "../../components/ui/slider";
export { Toaster } from "../../components/ui/sonner";
// Same sonner instance the Toaster listens to (a separately bundled `sonner` would never reach it).
export { toast } from "sonner";
export { tbToast } from "../../utils/tbToast";
export { Switch } from "../../components/ui/switch";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "../../components/ui/table";
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "../../components/ui/tabs";
export { Textarea } from "../../components/ui/textarea";
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

// -- brand -----------------------------------------------------------------
export { BrandLogo } from "../../components/brand-logo";
export { Discord } from "../../components/icons/discord";
export { Spotify } from "../../components/icons/spotify";
export { Twitch } from "../../components/icons/twitch";
export { YouTube } from "../../components/icons/youtube";

// -- app-level building blocks ---------------------------------------------
export { default as SubLabel } from "../../components/SubLabel";
export { default as MultiStepProgressBar } from "../../components/MultiStepProgressBar";
export { default as TrailblazerAccordian } from "../../components/TrailblazerAccordian/TrailblazerAccordian";
export { default as TrailblazerAccordianTrigger } from "../../components/TrailblazerAccordian/TrailblazerAccordianTrigger";
export { default as TrailblazerAccordianContent } from "../../components/TrailblazerAccordian/TrailblazerAccordianContent";
export { DeleteWidgetButton } from "../../components/button/DeleteWidgetButton";
export { SaveWidgetButton } from "../../components/button/SaveWidgetButton";
export { TestWidgetButton } from "../../components/button/TestWidgetButton";

// -- landing ---------------------------------------------------------------
export { Features } from "../../components/landing/features";
export { Footer } from "../../components/landing/footer";

// -- widget configuration --------------------------------------------------
export { ChannelRewardSelector } from "../../components/widget/ChannelRewardSelector";
export { MSDelaySlider } from "../../components/widget/MSDelaySlider";
export { OBSSetupHelp } from "../../components/widget/OBSSetupHelp";
export { OverlayUrlInput } from "../../components/widget/OverlayUrlInput";
export { ReplyMessageHelp } from "../../components/widget/ReplyMessageHelp";
export { ReplyMessageTextarea } from "../../components/widget/ReplyMessageTextarea";
export { default as WidgetEnabledBadge } from "../../components/widget/WidgetEnabledBadge";
export { WidgetStatusControl } from "../../components/widget/WidgetStatusControl";
export { WidgetTestControl } from "../../components/widget/WidgetTestControl";
export { WidgetTypeLoadError } from "../../components/widget/WidgetTypeLoadError";
export { WidgetStepper } from "../../components/widget/WidgetStepper/WidgetStepper";
export { default as WidgetStepperItem } from "../../components/widget/WidgetStepper/WidgetStepperItem/WidgetStepperItem";
export { default as WidgetStepperItems } from "../../components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
export { default as WidgetEnableStep } from "../../components/widget/WidgetStepper/WidgetEnableStep/WidgetEnableStep";
export { default as WidgetQuickStartCard } from "../../components/widget/widget-tab-card/WidgetQuickStartCard";
export { default as WidgetSettingsCardContent } from "../../components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
export { default as WidgetSettingsCardFooter } from "../../components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";

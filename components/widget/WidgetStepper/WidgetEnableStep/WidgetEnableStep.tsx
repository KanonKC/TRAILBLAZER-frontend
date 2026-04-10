import React from 'react'
import WidgetStepperItem from '../WidgetStepperItem/WidgetStepperItem'
import { WidgetStatusControl } from '../../WidgetStatusControl'

interface WidgetEnableStepProps {
    isEnabled: boolean;
    isSaving: boolean;
    onEnable: () => void;
}

const WidgetEnableStep = ({ isEnabled, isSaving, onEnable }: WidgetEnableStepProps) => {
  return (
    <WidgetStepperItem step={1} title="เปิดใช้งานวิดเจ็ต">
        <WidgetStatusControl
            isEnabled={isEnabled}
            isSaving={isSaving}
            onEnable={onEnable}
        />
    </WidgetStepperItem>
  )
}

export default WidgetEnableStep
import React from 'react'
import { WidgetStep } from '../WidgetStepper'
import WidgetStepperItem from '../WidgetStepperItem/WidgetStepperItem'

interface WidgetStepperItemsProps {
    items: WidgetStep[]
}

const WidgetStepperItems = ({ items }: WidgetStepperItemsProps) => {
  return (
    <>
    {items.map((item, index, array) => (
        <WidgetStepperItem key={item.step} step={item.step} drawLine={index !== array.length - 1} title={item.title}>
            {item.description}
        </WidgetStepperItem>
    ))}</>
  )
}

export default WidgetStepperItems
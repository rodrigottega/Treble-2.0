import * as React from "react"
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitives.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitives.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitives.Item
      ref={ref}
      className={cn(
        "border-primary text-primary focus-visible:ring-ring aspect-square h-4 w-4 rounded-full border shadow-sm focus:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitives.Indicator className="flex items-center justify-center">
        <i className="ri-checkbox-blank-circle-fill text-[8px] fill-current"></i>
      </RadioGroupPrimitives.Indicator>
    </RadioGroupPrimitives.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitives.Item.displayName

export { RadioGroup, RadioGroupItem }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#7b68ee] text-white shadow-sm hover:bg-[#6a5acd] rounded-[4px]", // ClickUp primary (brand purple)
        destructive:
          "bg-[#e74c3c] text-white shadow-sm hover:bg-[#c0392b] rounded-[4px]", // ClickUp danger red
        outline:
          "border border-[#E0E0E0] bg-white shadow-sm hover:bg-[#F7F8F9] rounded-[4px]", // ClickUp secondary
        secondary:
          "bg-[#F3F3F3] text-[#292d34] hover:bg-[#E0E0E0] rounded-[4px]", // ClickUp ghost/tertiary
        ghost: "hover:bg-[#F3F3F3] rounded-[4px]", // ClickUp ghost
        link: "text-[#0091FF] underline-offset-4 hover:underline rounded-[4px]", // ClickUp link blue
      },
      size: {
        default: "h-[36px] px-3 py-[6px]", // ClickUp small/standard: 6px top/bottom, 12px left/right
        sm: "h-[36px] px-3 py-[6px] text-xs rounded-[4px]",
        lg: "h-[48px] px-6 py-3 rounded-[6px]", // ClickUp large: 12px top/bottom, 24px left/right
        icon: "h-9 w-9 rounded-[4px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

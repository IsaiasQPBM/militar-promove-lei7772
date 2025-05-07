
// src/hooks/use-toast.ts
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

import {
  useToast as useToastPrimitive,
} from "@/components/ui/toast"

export type {
  Toast,
  ToastActionElement,
  ToastProps,
}

export const useToast = useToastPrimitive

export const toast = useToastPrimitive().toast

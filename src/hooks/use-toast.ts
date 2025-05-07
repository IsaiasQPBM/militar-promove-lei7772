
// src/hooks/use-toast.ts
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

import { useToaster } from "@/components/ui/toast";

export type {
  Toast,
  ToastActionElement,
  ToastProps,
};

export const useToast = useToaster;

export const toast = useToaster().toast;

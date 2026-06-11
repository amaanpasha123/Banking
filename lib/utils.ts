import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatAmount = (amount: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
};

export const extractCustomerIdFromUrl = (url: string) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

export const encryptId = (id: string) => btoa(id);

export const parseStringify = <T>(value: T): T => JSON.parse(JSON.stringify(value));

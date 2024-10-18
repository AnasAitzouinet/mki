import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date))
}
 

export function parseDateString(dateString: string): Date {
  const parts = dateString.split(/[/ :]/)
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T${parts[3]}:${parts[4]}`)
}

export function parseDateStringV2(dateString :string | null) {
  if (!dateString) return "";

  // Check if dateString matches 'DD/MM/YYYY HH:mm' format
  const dateTimeParts = dateString.split(" ");
  const datePart = dateTimeParts[0];
  const dateComponents = datePart.split("/");

  if (dateComponents.length === 3) {
    // Format is 'DD/MM/YYYY'
    const [day, month, year] = dateComponents;

    if (day && month && year) {
      // Ensure day and month are two digits
      const dayFormatted = day.padStart(2, "0");
      const monthFormatted = month.padStart(2, "0");
      return `${year}-${monthFormatted}-${dayFormatted}`;
    }
  }

  // Check if dateString matches 'YYYY-MM-DD' format
  const isoDateComponents = dateString.split("-");
  if (isoDateComponents.length === 3) {
    // Format is 'YYYY-MM-DD'
    const [year, month, day] = isoDateComponents;
    if (year && month && day) {
      return `${year}-${month}-${day}`;
    }
  }

  // If all else fails, return an empty string
  return "";
}

/**
 * Stole this from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {}
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event)
    }
  }
}

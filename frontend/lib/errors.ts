// lib/errors.ts
import { isAxiosError } from "axios"

// Fallbacks for when the backend gives no message at all (e.g. the server
// is down, or a network error with no response object).
const FRIENDLY_STATUS_MESSAGES: Record<number, string> = {
  400: "Please check the information you entered.",
  401: "Incorrect email or password.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you're looking for.",
  409: "That email is already registered.",
  429: "Too many attempts. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again shortly.",
}

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    if (!err.response) {
      return "Unable to reach the server. Check your connection and try again."
    }

    const backendMessage = err.response.data?.message
    // class-validator sends an array when multiple fields fail at once
    if (Array.isArray(backendMessage)) return backendMessage[0]
    if (typeof backendMessage === "string") return backendMessage

    return FRIENDLY_STATUS_MESSAGES[err.response.status] ?? "Something went wrong. Please try again."
  }

  return err instanceof Error ? err.message : "Something went wrong. Please try again."
}
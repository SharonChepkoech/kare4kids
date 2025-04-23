import { toast } from "react-toastify";

export function handleApiError(error: unknown, fallbackMessage = "Something went wrong.") {
  if (error instanceof Error) {
    if (error.message === "Failed to fetch") {
      toast.error("Network error. Please check your internet connection.");
    } else {
      toast.error(error.message || fallbackMessage);
    }
  } else {
    toast.error(fallbackMessage);
  }
}

export function showErrorToast(message: string) {
  toast.error(message);
}

export function showSuccessToast(message: string) {
  toast.success(message);
}

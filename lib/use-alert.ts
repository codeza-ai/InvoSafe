import { useAlert, AlertVariant } from "@/lib/alert-context";

/**
 * Custom hook that provides alert functionality
 * Returns functions to show different types of alerts
 */
export function useAlertActions() {
  const { showAlert } = useAlert();

  return {
    // Generic alert function
    showAlert: (message: string, variant: AlertVariant = "default") => 
      showAlert(message, variant),
    
    // Convenience functions for specific types
    showError: (message: string) => showAlert(message, "destructive"),
    showSuccess: (message: string) => showAlert(message, "success"),
    showWarning: (message: string) => showAlert(message, "warning"),
    showInfo: (message: string) => showAlert(message, "default"),
  };
}

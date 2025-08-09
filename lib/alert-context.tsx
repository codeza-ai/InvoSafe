"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type AlertVariant = "default" | "destructive" | "success" | "warning";

interface AlertState {
  message: string;
  variant: AlertVariant;
  isVisible: boolean;
}

interface AlertContextType {
  showAlert: (message: string, variant?: AlertVariant) => void;
  hideAlert: () => void;
  alert: AlertState;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    variant: "default",
    isVisible: false,
  });

  const showAlert = (message: string, variant: AlertVariant = "default") => {
    setAlert({
      message,
      variant,
      isVisible: true,
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({
      ...prev,
      isVisible: false,
    }));
  };

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (alert.isVisible) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert.isVisible]);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // The refetchInterval is set to 5 minutes (300 seconds)
  // This means the session will be refreshed every 5 minutes.
  return (
    <SessionProvider refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  );
}
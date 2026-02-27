"use client";

import { Toaster } from "@/components/ui/sonner";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="top-center" richColors closeButton expand={true} />
      {children}
    </>
  );
};
export default Providers;

"use client";

import { SignUp } from "@clerk/nextjs";
import { ClerkErrorBoundary } from "@/components/clerk-error-boundary";

export default function SignUpPage() {
  return (
    <ClerkErrorBoundary>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg",
            },
          }}
        />
      </div>
    </ClerkErrorBoundary>
  );
}

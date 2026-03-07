"use client";

import { SignIn } from "@clerk/nextjs";
import { ClerkErrorBoundary } from "@/components/clerk-error-boundary";

export default function SignInPage() {
  return (
    <ClerkErrorBoundary>
      <div className="flex min-h-screen items-center justify-center bg-background">
        <SignIn
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

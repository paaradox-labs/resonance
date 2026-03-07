import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardView } from "@/features/dashboard/views/dashboard-view";

function isClerkDownError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("clerk") ||
      message.includes("service unavailable") ||
      message.includes("503") ||
      message.includes("502") ||
      message.includes("econnrefused")
    );
  }
  return false;
}

export default async function Dashboard() {
  let userId: string | null = null;
  let clerkError: unknown = null;

  try {
    const authResult = await auth();
    userId = authResult.userId;
  } catch (error) {
    clerkError = error;
  }

  if (clerkError && isClerkDownError(clerkError)) {
    redirect("/offline");
  }

  if (!userId) {
    redirect("/sign-in");
  }

  return <DashboardView />;
}

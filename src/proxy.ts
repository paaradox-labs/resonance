import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/offline(.*)",
]);

const isKnownRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/offline(.*)",
  "/org-selection(.*)",
]);

function isClerkDown(): boolean {
  return process.env.CLERK_DOWN === "true";
}

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

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  if (isClerkDown()) {
    if (!pathname.startsWith("/offline")) {
      return NextResponse.redirect(new URL("/offline", req.url));
    }
    return NextResponse.next();
  }

  try {
    const { userId, orgId } = await auth();

    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (!isKnownRoute(req)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (userId && !orgId) {
      return NextResponse.redirect(new URL("/org-selection", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (isClerkDownError(error)) {
      return NextResponse.redirect(new URL("/offline", req.url));
    }
    throw error;
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

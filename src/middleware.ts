import createMiddleware from "next-intl/middleware";
import { auth } from "@/auth";
import { chain, FinalNextResponse } from "@nimpl/middleware-chain";
import { NextRequest } from "next/server";

const intlMiddelware = createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "cn"],
  localePrefix: "as-needed",

  // Used when no locale matches
  defaultLocale: "cn",
});

export default chain([
  intlMiddelware,
  (req) => {
    if (req.summary.type === "redirect") return FinalNextResponse.next();
  },
  auth as any,
]);
export const config = {
  matcher: ["/((?!api|_next/static|.*\\..*).*)"],
};

import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  // The two strategy pillars: how the model differs, and how long it runs.
  route("difference", "routes/difference.tsx"),
  route("lifecycle", "routes/lifecycle.tsx"),
  route("insights", "routes/insights.tsx"),
  route("insights/:slug", "routes/insight.tsx"),
  route("careers", "routes/careers.tsx"),
  route("faqs", "routes/faqs.tsx"),
  route("contact", "routes/contact.tsx"),
  route("privacy", "routes/legal-privacy.tsx"),
  route("cookies", "routes/legal-cookies.tsx"),
  route("terms", "routes/legal-terms.tsx"),

  // Backend (Vercel/SSR): enquiry sink + admin submissions dashboard.
  route("api/submit", "routes/api.submit.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboard/login", "routes/dashboard.login.tsx"),

  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;

import { type RouteConfig, index, route } from "@react-router/dev/routes";

/**
 * Alpha (coming-soon): the site is the homepage hero only. Every other path
 * falls through the catch-all to the same hero, so there are no other pages.
 */
export default [
  index("routes/home.tsx"),
  route("*", "routes/home.tsx", { id: "catch-all" }),
] satisfies RouteConfig;

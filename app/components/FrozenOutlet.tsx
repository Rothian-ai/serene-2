import { useContext, useRef } from "react";
import {
  UNSAFE_DataRouterStateContext as DataRouterStateContext,
  UNSAFE_LocationContext as LocationContext,
  useOutlet,
} from "react-router";
import { useIsPresent } from "framer-motion";

/**
 * The route outlet for a page that animates out under AnimatePresence.
 *
 * A plain <Outlet/> inside the exiting <motion.main> renders whatever route is
 * current, so on a client-side navigation the NEW route mounted twice: once
 * inside the main that was fading out, and again in the fresh main after the
 * exit. Its mount effects ran twice, which double-counted property_view,
 * developer_view and insight_read in GA4, and the first of each pair fired
 * before root's pageView() had moved GA4 on to the new page.
 *
 * While its main is on screen this renders the live outlet, so same-path
 * navigations (search params, revalidation, error boundaries) update as
 * normal. Once AnimatePresence marks the main as leaving, it keeps rendering
 * the route it last showed, with the router state and location it had then:
 * the router drops a route's loader data as soon as the route stops matching,
 * so the leaving page would otherwise re-render with none and fail on its
 * own useLoaderData(). The providers are always rendered, so the element
 * tree keeps its shape and the leaving page is never remounted.
 */
export function FrozenOutlet() {
  const outlet = useOutlet();
  const state = useContext(DataRouterStateContext);
  const location = useContext(LocationContext);
  const present = useIsPresent();
  const shown = useRef({ outlet, state, location });
  if (present) shown.current = { outlet, state, location };
  const kept = shown.current;
  return (
    <LocationContext.Provider value={kept.location}>
      <DataRouterStateContext.Provider value={kept.state}>{kept.outlet}</DataRouterStateContext.Provider>
    </LocationContext.Provider>
  );
}

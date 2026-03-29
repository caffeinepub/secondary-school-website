/**
 * Minimal react-router-dom compatibility shim using native History API.
 * Implements BrowserRouter, Routes, Route, Link, and useLocation.
 */
import {
  type ReactElement,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface RouterContextType {
  pathname: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: "/",
  navigate: () => {},
});

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    window.history.pushState(null, "", to);
    setPathname(to);
  }, []);

  const value = useMemo(() => ({ pathname, navigate }), [pathname, navigate]);
  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function useLocation() {
  const { pathname } = useContext(RouterContext);
  return { pathname };
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}

interface RouteProps {
  path: string;
  element: ReactElement;
}

export function Routes({ children }: { children: ReactNode }) {
  const { pathname } = useContext(RouterContext);
  const childArray = Array.isArray(children) ? children : [children];
  for (const child of childArray as ReactElement<RouteProps>[]) {
    if (!child?.props?.path) continue;
    const pattern = child.props.path.replace(/\/\*$/, "");
    if (
      (child.props.path.endsWith("/*") && pathname.startsWith(pattern)) ||
      pathname === child.props.path ||
      (pattern && pathname === pattern)
    ) {
      return child.props.element;
    }
  }
  // fallback to first route (index)
  const first = (childArray as ReactElement<RouteProps>[])[0];
  return first?.props?.element ?? null;
}

export function Route(_props: RouteProps) {
  return null;
}

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  "data-ocid"?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function Link({ to, children, className, ...rest }: LinkProps) {
  const { navigate } = useContext(RouterContext);
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        rest.onClick?.(e);
      }}
      data-ocid={rest["data-ocid"]}
    >
      {children}
    </a>
  );
}

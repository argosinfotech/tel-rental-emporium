import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, UserRound } from "lucide-react";
import { BRAND } from "@/lib/brand";
import {
  cartItemCount,
  clearCart,
  clearSelectedEvent,
  clearStoreSession,
  getCart,
  getSelectedEvent,
  type StoreCartLine,
} from "@/lib/event-store-session";
import {
  formatEventDateRange,
  type InventoryEvent,
} from "@/lib/mock-events";
import { CartDrawer } from "@/components/event-store/CartDrawer";

type StoreContextValue = {
  event: InventoryEvent;
  cart: StoreCartLine[];
  refreshCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  cartOpen: boolean;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function useStoreContext(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStoreContext must be used within StoreShell");
  }
  return ctx;
}

type StoreShellProps = {
  event: InventoryEvent;
  children: ReactNode;
  showEventBar?: boolean;
};

export function StoreShell({
  event,
  children,
  showEventBar = true,
}: StoreShellProps) {
  const navigate = useNavigate();
  const [cart, setCart] = useState<StoreCartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const refreshCart = useCallback(() => {
    setCart(getCart());
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const changeEvent = () => {
    clearSelectedEvent();
    clearCart();
    void navigate({ to: "/store" });
  };

  const exitEvent = () => {
    clearStoreSession();
    void navigate({ to: "/" });
  };

  const value = useMemo(
    () => ({
      event,
      cart,
      refreshCart,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      cartOpen,
    }),
    [event, cart, refreshCart, cartOpen],
  );

  const count = cartItemCount(cart);

  return (
    <StoreContext.Provider value={value}>
      <div className="flex min-h-screen flex-col bg-white text-[#1a1a1a]">
        {showEventBar && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#2a2a2a] px-4 py-2 text-xs text-white sm:px-6">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: BRAND.primary }}
              >
                Current Event
              </span>
              <span className="text-sm font-medium">{event.eventName}</span>
              <span className="text-white/70">
                {formatEventDateRange(event)}
              </span>
              <span className="rounded bg-[#555] px-2 py-0.5 text-[10px] font-semibold tracking-wide">
                {event.eventCode}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button
                type="button"
                onClick={changeEvent}
                className="underline underline-offset-2 hover:text-white/80"
              >
                Change event
              </button>
              <button
                type="button"
                onClick={exitEvent}
                className="underline underline-offset-2 hover:text-white/80"
              >
                Exit event
              </button>
            </div>
          </div>
        )}

        <header className="flex items-center justify-between gap-4 bg-black px-4 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/store/home" className="flex items-center gap-2">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: BRAND.primary }}
              >
                TEL
              </span>
              <span className="text-sm font-semibold text-white">
                The Event Lounge
              </span>
            </Link>
            <Link
              to="/store/home"
              className="text-xs font-semibold uppercase tracking-wide text-white hover:opacity-80"
              style={{ color: BRAND.primary }}
            >
              Home
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/store/shop"
              className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: BRAND.primary }}
            >
              Shop
            </Link>
            <button
              type="button"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative rounded-full border border-white/30 p-2 text-white hover:bg-white/10"
            >
              <ShoppingCart className="h-4 w-4" />
              <span
                className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-black"
                style={{ backgroundColor: "#fff" }}
              >
                {count}
              </span>
            </button>
            <button
              type="button"
              aria-label="Account"
              className="rounded-full border border-white/30 p-2 text-white hover:bg-white/10"
            >
              <UserRound className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-black py-6 text-center text-xs text-white/50">
          © 2026 All Rights Reserved The Event Lounge
        </footer>
      </div>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </StoreContext.Provider>
  );
}

/** Guard + shell wrapper for authenticated store pages */
export function RequireStoreEvent({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [event, setEvent] = useState<InventoryEvent | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const selected = getSelectedEvent();
    if (!selected || selected.status !== "Live") {
      setEvent(null);
      void navigate({ to: "/store" });
      return;
    }
    setEvent(selected);
  }, [navigate]);

  if (event === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }
  if (!event) return null;

  return <StoreShell event={event}>{children}</StoreShell>;
}

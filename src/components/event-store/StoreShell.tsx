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
      <div className="flex min-h-screen flex-col bg-white font-sans text-[#1a1a1a] antialiased [font-family:Open_Sans,ui-sans-serif,system-ui,sans-serif]">
        {showEventBar && (
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#222] px-4 py-2 text-[11px] leading-none text-white sm:px-6 sm:text-xs">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
              <span className="font-semibold uppercase tracking-[0.12em] text-white">
                Current Event
              </span>
              <span className="font-medium text-white">{event.eventName}</span>
              <span className="text-white/70">
                {formatEventDateRange(event)}
              </span>
              <span className="rounded-sm bg-[#555] px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
                {event.eventCode}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white sm:text-sm">
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

        <header className="flex h-[60px] items-center justify-between gap-4 bg-black px-4 sm:h-[72px] sm:px-6">
          <div className="flex min-w-0 items-center gap-6 sm:gap-10">
            <Link
              to="/store/home"
              className="flex h-full shrink-0 items-center"
              aria-label="The Event Lounge home"
            >
              <img
                src="/event-lounge-logo.webp"
                alt="The Event Lounge"
                className="h-10 w-auto max-w-[210px] object-contain object-left sm:h-12 sm:max-w-[260px]"
              />
            </Link>
            <Link
              to="/store/home"
              className="text-[11px] font-bold uppercase tracking-[0.18em] text-white hover:opacity-80"
            >
              Home
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-3.5">
            <Link
              to="/store/shop"
              className="rounded-full px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
              style={{ backgroundColor: BRAND.primary }}
            >
              Shop
            </Link>
            <button
              type="button"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 hover:bg-white/5"
              style={{ borderColor: BRAND.primary, color: "#fff" }}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#1a1a1a]">
                {count}
              </span>
            </button>
            <button
              type="button"
              aria-label="Account"
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 hover:bg-white/5"
              style={{ borderColor: BRAND.primary, color: "#fff" }}
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

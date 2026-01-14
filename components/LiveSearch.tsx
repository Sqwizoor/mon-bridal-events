"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function LiveSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  // Debounce query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch results
  const shouldSearch = debouncedQuery.length >= 2;
  const results = useQuery(
    api.products.search,
    shouldSearch ? { query: debouncedQuery } : "skip"
  );
  const isLoading = results === undefined && shouldSearch;

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-[220px] hidden lg:block">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitSearch();
        }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-10 pr-4 h-10 bg-white text-black placeholder:text-gray-400 border border-gray-200 rounded-lg focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:border-amber-400 transition-all"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </form>

      {isOpen && (query.trim().length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {isLoading ? (
            <div className="p-2 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                   <Skeleton className="h-10 w-10 rounded-md" />
                   <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                   </div>
                </div>
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto py-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Products
              </div>
              {results.map((product: any) => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors group"
                >
                  <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden flex-shrink-0">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <Search className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      R{product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2 px-3 pb-2">
                <button
                  onClick={submitSearch}
                  className="w-full text-center text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  View all results
                </button>
              </div>
            </div>
          ) : debouncedQuery.length > 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No products found.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

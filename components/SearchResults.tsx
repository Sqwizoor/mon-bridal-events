"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.trim();

  const results = useQuery(
    api.products.search,
    query.length >= 2 ? { query } : "skip"
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif font-bold">
        Search Results for "{query}"
      </h1>

      {query.length < 2 ? (
        <p className="text-muted-foreground">Type at least 2 characters.</p>
      ) : null}
      
      {query.length >= 2 && results === undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {[...Array(4)].map((_, i) => (
             <Skeleton key={i} className="h-[250px] w-full rounded-xl" />
           ))}
        </div>
      ) : query.length >= 2 && results && results.length === 0 ? (
        <p className="text-muted-foreground">No results found.</p>
      ) : query.length >= 2 && results ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

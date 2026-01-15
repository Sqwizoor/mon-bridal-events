"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PRODUCTS_PER_PAGE = 8;

export default function SearchResults() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.trim();
  const [currentPage, setCurrentPage] = useState(1);

  const results = useQuery(
    api.products.search,
    query.length >= 2 ? { query } : "skip"
  );

  // Calculate pagination
  const totalProducts = results?.length || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = results?.slice(startIndex, endIndex) || [];

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

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
             <Skeleton key={i} className="h-62.5 w-full rounded-xl" />
           ))}
        </div>
      ) : query.length >= 2 && results && results.length === 0 ? (
        <p className="text-muted-foreground">No results found.</p>
      ) : query.length >= 2 && results ? (
        <>
          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} results
          </p>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((page, index) => (
                typeof page === "number" ? (
                  <Button
                    key={index}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10"
                  >
                    {page}
                  </Button>
                ) : (
                  <span key={index} className="px-2 text-muted-foreground">...</span>
                )
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

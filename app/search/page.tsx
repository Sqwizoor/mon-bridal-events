import { Suspense } from "react";
import SearchResults from "@/components/SearchResults";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-black text-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-6 w-6 md:h-8 md:w-8 text-amber-400" />
            <h1 className="font-serif text-2xl md:text-4xl font-bold">Search Results</h1>
          </div>
          <p className="text-gray-400 text-sm md:text-base">
            Find what you're looking for in our collection
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <Suspense fallback={
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}

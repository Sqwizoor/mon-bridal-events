import { Suspense } from "react";
import SearchResults from "@/components/SearchResults";

export default function SearchPage() {
  return (
    <div className="container py-12">
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}

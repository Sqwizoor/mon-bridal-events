"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-red-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Error Icon */}
          <div className="relative">
            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 max-w-md">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
              Oops!
            </h1>
            <h2 className="text-xl font-medium text-gray-700">
              Something went wrong
            </h2>
            <p className="text-muted-foreground">
              We apologize for the inconvenience. Our team has been notified and 
              is working to fix the issue. Please try again.
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground font-mono bg-gray-100 px-3 py-1 rounded">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              onClick={reset} 
              size="lg" 
              className="bg-red-500 hover:bg-red-600"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </a>
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-8 border-t w-full max-w-lg">
            <p className="text-sm text-muted-foreground">
              If the problem persists, please contact us at{" "}
              <a href="mailto:support@monbridal.co.za" className="text-primary underline">
                support@monbridal.co.za
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

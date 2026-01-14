"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom, #fef2f2, #ffffff)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
          <div style={{
            textAlign: "center",
            padding: "2rem",
            maxWidth: "500px",
          }}>
            {/* Error Icon */}
            <div style={{
              width: "80px",
              height: "80px",
              background: "#fee2e2",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
            }}>
              <svg 
                width="40" 
                height="40" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>

            <h1 style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "0.5rem",
            }}>
              500 - Server Error
            </h1>
            
            <p style={{
              color: "#6b7280",
              marginBottom: "2rem",
              lineHeight: "1.6",
            }}>
              We're experiencing technical difficulties. Our team has been notified 
              and is working on a fix. Please try again in a few moments.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={reset}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "1rem",
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "white",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "1rem",
                }}
              >
                Go Home
              </a>
            </div>

            {error.digest && (
              <p style={{
                marginTop: "2rem",
                fontSize: "0.75rem",
                color: "#9ca3af",
                fontFamily: "monospace",
                background: "#f3f4f6",
                padding: "0.5rem 1rem",
                borderRadius: "0.25rem",
              }}>
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

import React from "react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold mb-8">Terms and Conditions</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="mb-4">
          Welcome to MON Bridal and Events. By accessing or using our website and services, you agree to be bound by these Terms and Conditions.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use of Services</h2>
        <p className="mb-4">
          You agree to use our services only for lawful purposes and in accordance with these Terms.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Product Availability</h2>
        <p className="mb-4">
          All products and services are subject to availability. We reserve the right to discontinue any product at any time.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Booking and Payments</h2>
        <p className="mb-4">
          Bookings are confirmed upon receipt of payment. Prices are subject to change without notice.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us.
        </p>
      </div>
    </div>
  );
}

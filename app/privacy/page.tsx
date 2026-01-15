import React from "react";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="mb-4">
          At MON Bridal and Events, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </div>
    </div>
  );
}

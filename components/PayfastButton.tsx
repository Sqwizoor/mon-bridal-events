import React, { useState } from 'react';

interface PayfastButtonProps {
  amount: string;
  itemName: string;
  itemDescription: string;
  email: string;
}

export const PayfastButton: React.FC<PayfastButtonProps> = ({ amount, itemName, itemDescription, email }) => {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const res = await fetch('/api/payfast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, item_name: itemName, item_description: itemDescription, email }),
    });
    const { payfastUrl, data } = await res.json();
    // Create and submit a form to redirect to Payfast
    const form = document.createElement('form');
    form.action = payfastUrl;
    form.method = 'POST';
    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    setLoading(false);
  };

  return (
    <button onClick={handlePay} disabled={loading} className="px-6 py-2 bg-black text-white rounded shadow hover:bg-gray-800 transition">
      {loading ? 'Processing...' : 'Pay with Payfast'}
    </button>
  );
};

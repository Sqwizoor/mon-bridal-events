export async function initiatePayFastPayment(orderId: string) {
  try {
    const res = await fetch('/api/payfast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId }),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to initialize payment');
    }

    const { payfastUrl, data } = await res.json();

    // Create and submit a form to redirect to Payfast
    const form = document.createElement('form');
    form.action = payfastUrl;
    form.method = 'POST';
    form.style.display = 'none';

    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value as string;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  } catch (error) {
    console.error("PayFast Error:", error);
    throw error;
  }
}

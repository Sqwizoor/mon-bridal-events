import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// Load Payfast credentials from environment variables
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE;
const PAYFAST_URL = 'https://www.payfast.co.za/eng/process';

function generateSignature(data: Record<string, string>, passphrase?: string) {
  let pfOutput = '';
  Object.keys(data).forEach((key) => {
    if (data[key] !== '') {
      pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}&`;
    }
  });
  if (passphrase) {
    pfOutput += `passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
  } else {
    pfOutput = pfOutput.slice(0, -1);
  }
  return crypto.createHash('md5').update(pfOutput).digest('hex');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get payment details from request body
  const { amount, item_name, item_description, email } = req.body;

  // Prepare Payfast data
  const data: Record<string, string> = {
    merchant_id: PAYFAST_MERCHANT_ID || '',
    merchant_key: PAYFAST_MERCHANT_KEY || '',
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,
    notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payfast`,
    amount: amount,
    item_name: item_name,
    item_description: item_description,
    email_address: email,
  };

  // Generate signature
  data['signature'] = generateSignature(data, PAYFAST_PASSPHRASE);

  // Respond with Payfast form data
  res.status(200).json({
    payfastUrl: PAYFAST_URL,
    data,
  });
}

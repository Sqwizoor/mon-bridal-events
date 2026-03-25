import type { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Initialize Convex Client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Load Payfast credentials from environment variables
const PAYFAST_MERCHANT_ID = process.env.PAYFAST_MERCHANT_ID;
const PAYFAST_MERCHANT_KEY = process.env.PAYFAST_MERCHANT_KEY;
const PAYFAST_PASSPHRASE = process.env.PAYFAST_PASSPHRASE;
// Use Sandbox for testing if not production, or user default
const PAYFAST_URL = process.env.NODE_ENV === 'production' 
    ? 'https://www.payfast.co.za/eng/process'
    : 'https://sandbox.payfast.co.za/eng/process';
const PAYFAST_HOST = process.env.NODE_ENV === 'production'
    ? 'www.payfast.co.za'
    : 'sandbox.payfast.co.za';

// PayFast requires fields in a SPECIFIC ORDER for signature generation
const PAYFAST_FIELD_ORDER = [
  'merchant_id',
  'merchant_key',
  'return_url',
  'cancel_url',
  'notify_url',
  'name_first',
  'name_last',
  'email_address',
  'cell_number',
  'm_payment_id',
  'amount',
  'item_name',
  'item_description',
  'custom_int1',
  'custom_int2',
  'custom_int3',
  'custom_int4',
  'custom_int5',
  'custom_str1',
  'custom_str2',
  'custom_str3',
  'custom_str4',
  'custom_str5',
  'email_confirmation',
  'confirmation_address',
  'payment_method',
];

function generateSignature(data: Record<string, string>, passphrase?: string) {
  let pfOutput = '';
  
  // Use the REQUIRED field order for PayFast
  PAYFAST_FIELD_ORDER.forEach((key) => {
    if (data[key] && data[key] !== '') {
      pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, '+')}&`;
    }
  });
  
  // Remove trailing ampersand if no passphrase
  if (passphrase && passphrase.trim() !== '') {
    pfOutput += `passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
  } else {
    pfOutput = pfOutput.slice(0, -1);
  }
  
  return crypto.createHash('md5').update(pfOutput).digest('hex');
}

// Fixed ITN validation to use the exact fields provided in the URL in the order they were provided
async function validatePayfastItnSignature(params: URLSearchParams, passphrase?: string) {
    const signature = params.get('signature');
    let pfOutput = '';
    
    for (const [key, value] of params.entries()) {
        if (key !== 'signature') {
            pfOutput += `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, '+')}&`;
        }
    }

    if (passphrase && passphrase.trim() !== '') {
        pfOutput += `passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`;
    } else if (pfOutput.length > 0) {
        pfOutput = pfOutput.slice(0, -1);
    }
    
    const generatedSignature = crypto.createHash('md5').update(pfOutput).digest('hex');
    return signature === generatedSignature;
}

// NextJS 13+ App Router Route Handler
export async function POST(req: Request) {
  const contentType = req.headers.get('content-type') || '';

  // 1. Handle JSON Request (Client requesting Signature)
  if (contentType.includes('application/json')) {
    try {
        const body = await req.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        // Fetch Order from Convex to ensure Amount integrity
        const order = await convex.query(api.orders.getById, { id: orderId as Id<"orders"> });
        
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if order is already paid
        if (order.paymentStatus === 'paid') {
             return NextResponse.json({ error: 'Order is already paid' }, { status: 400 });
        }

        // Prepare Payfast data - ORDER MATTERS for signature!
        const data: Record<string, string> = {
            merchant_id: PAYFAST_MERCHANT_ID || '',
            merchant_key: PAYFAST_MERCHANT_KEY || '',
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?orderId=${orderId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel?orderId=${orderId}`,
            notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payfast`,
            email_address: order.guestEmail || '',
            m_payment_id: orderId,
            amount: order.total.toFixed(2),
            item_name: `Order ${order.orderNumber}`.substring(0, 100), // Max 100 chars
            item_description: `Payment for Order ${order.orderNumber}`.substring(0, 255), // Max 255 chars
            custom_str1: orderId,
        };

        // Remove empty fields to avoid signature mismatch!
        Object.keys(data).forEach(key => {
            if (data[key] === '' || data[key] === null || data[key] === undefined) {
                delete data[key];
            }
        });

        // Generate signature
        data['signature'] = generateSignature(data, PAYFAST_PASSPHRASE);

        return NextResponse.json({
            payfastUrl: PAYFAST_URL,
            data,
        });

    } catch (error) {
        console.error("Signature Generation Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 
  
  // 2. Handle Form Data (PayFast ITN Callback)
  else if (contentType.includes('application/x-www-form-urlencoded')) {
      try {
        const text = await req.text();
        const params = new URLSearchParams(text);
        const data: Record<string, string> = {};
        for (const [key, value] of params.entries()) {
            data[key] = value;
        }

        console.log("Received ITN:", data);

        // A. Validate Signature checking params
        const isValidSignature = await validatePayfastItnSignature(params, PAYFAST_PASSPHRASE);
        if (!isValidSignature) {
            console.error("Invalid ITN Signature");
            return new NextResponse('Invalid Signature', { status: 400 });
        }

        // B. Verify Source IP (Optional but recommended - skipped here for brevity/serverless)
        // You would DNS lookup the IP to ensure it's from payfast

        // C. Check Payment Status
        if (data['payment_status'] !== 'COMPLETE') {
            console.log("Payment not complete:", data['payment_status']);
            return new NextResponse('Payment not complete', { status: 200 }); // Return 200 to stop PayFast retrying
        }

        // D. Update Order
        const orderId = data['custom_str1'];
        const pfPaymentId = data['pf_payment_id'];
        const amountGross = parseFloat(data['amount_gross']);

        if (!orderId) {
             console.error("No Order ID in ITN");
             return new NextResponse('Missing Order ID', { status: 400 });
        }

        await convex.mutation(api.orders.payOrder, {
            id: orderId as Id<"orders">,
            paymentId: pfPaymentId,
            amount: amountGross,
            secret: "CkH8g42@!9" // Matching the secret in orders.ts
        });

        return new NextResponse('OK', { status: 200 });

      } catch (error) {
          console.error("ITN Error:", error);
          return new NextResponse('ITN Error', { status: 500 });
      }
  }

  return new NextResponse('Unsupported Content Type', { status: 400 });
}

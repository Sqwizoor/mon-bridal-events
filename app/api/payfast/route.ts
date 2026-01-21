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

async function validatePayfastSignature(data: Record<string, string>, passphrase?: string) {
    const signature = data['signature'];
    const temp = { ...data };
    delete temp['signature'];
    const generatedSignature = generateSignature(temp, passphrase);
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

        // Prepare Payfast data
        const data: Record<string, string> = {
            merchant_id: PAYFAST_MERCHANT_ID || '',
            merchant_key: PAYFAST_MERCHANT_KEY || '',
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?orderId=${orderId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel?orderId=${orderId}`,
            notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payfast`,
            
            // Item Details
            m_payment_id: orderId, // Use Order ID as merchant payment id
            amount: order.total.toFixed(2),
            item_name: `Order ${order.orderNumber}`,
            item_description: `Payment for Order ${order.orderNumber}`,
            
            // User Details
            email_address: order.guestEmail || '', // If auth user, might need to fetch user details. But schema has guestEmail or userId.
            
            // Custom String to store Order ID securely for ITN
            custom_str1: orderId,
        };

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

        // A. Validate Signature
        const isValidSignature = await validatePayfastSignature(data, PAYFAST_PASSPHRASE);
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

# Fix: Clerk Authentication Not Working with Convex

## Problem
You're getting `identity: undefined` because Clerk is not configured to send JWT tokens to Convex.

## Solution: Create Clerk JWT Template

### Step 1: Go to Clerk Dashboard
1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to **JWT Templates** (in the left sidebar under "Configure")

### Step 2: Create Convex Template
1. Click **"+ New template"**
2. Select **"Convex"** from the list (or choose "Blank" if Convex isn't listed)
3. Name it: `convex`
4. Set the following:

**Token Lifetime:** `3600` seconds (1 hour)

**Claims:**
```json
{
  "aud": "convex"
}
```

5. Click **"Save"**

### Step 3: Get Your Issuer URL
1. In the same JWT Templates page, you'll see your **Issuer URL**
2. Copy it - it looks like: `https://your-app.clerk.accounts.dev`

### Step 4: Add to Convex Dashboard
1. Go to https://dashboard.convex.dev
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
CLERK_ISSUER_URL=https://your-app.clerk.accounts.dev
```

(Replace with your actual issuer URL from Step 3)

### Step 5: Update Your Code (Already Done)
Your `ConvexClientProvider.tsx` already has the correct setup:
```tsx
<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
```

### Step 6: Restart Everything
1. Stop your dev server (`Ctrl+C`)
2. Stop Convex dev (`Ctrl+C` in the Convex terminal)
3. Restart Convex: `npx convex dev`
4. Restart Next.js: `npm run dev`
5. **Sign out and sign back in**
6. Try creating a product

## Verify It's Working

After setup, the Convex logs should show:
```
🔐 verifyAdmin - identity: user_xxxxxxxxxxxxx
👤 verifyAdmin - user found: your@email.com (role: admin)
✅ Admin verified: your@email.com
```

Instead of:
```
🔐 verifyAdmin - identity: undefined
❌ No identity found
```

## Alternative: Check Environment Variables

Make sure you have these in your `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
```

## Still Not Working?

If it still doesn't work after the JWT template setup:

1. **Clear browser cache completely**
2. **Use Incognito/Private mode**
3. **Sign in fresh**
4. **Check Convex logs** for the 🔐 emoji - it should show your user ID, not undefined

## Why This Happens

Clerk needs to be explicitly configured to generate JWT tokens for Convex. Without the JWT template:
- Clerk authenticates you (frontend works)
- But doesn't send auth tokens to Convex (backend fails)
- Result: `identity: undefined` in Convex

The JWT template tells Clerk: "When this user makes requests to Convex, include authentication."

# Admin Setup Instructions

## Problem
You're getting "Not authenticated" error when trying to create products because your user doesn't have admin role in Convex.

## Solution - Choose ONE of these methods:

### Method 1: Convex Dashboard (Easiest)
1. Go to https://dashboard.convex.dev
2. Select your project: **MON Bridal and Events**
3. Click on the **Data** tab
4. Find the **users** table
5. Locate your user (search by your email)
6. Click on your user row to edit it
7. Change the `role` field from `"customer"` to `"admin"`
8. Save the changes
9. Refresh your admin dashboard page

### Method 2: Use Clerk Dashboard
1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to **Users** section
4. Find your user account
5. Click on your user
6. Go to **Metadata** tab
7. Under **Public metadata**, add:
   ```json
   {
     "role": "admin"
   }
   ```
8. Save changes
9. Sign out and sign back in
10. The UserSync component will automatically sync this to Convex

### Method 3: Create a Temporary Admin Button
1. Add this button temporarily to your admin page:

```tsx
// Add to app/admin/page.tsx
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

// Inside your component:
const setAdmin = useMutation(api.users.setAdmin);

// Add this button:
<Button onClick={async () => {
  try {
    const result = await setAdmin();
    toast.success(result);
    window.location.reload();
  } catch (error) {
    toast.error("Failed to set admin role");
  }
}}>
  Make Me Admin (Click Once)
</Button>
```

2. Click the button once
3. Remove the button after you become admin

## Verify It Worked
1. Check Convex Dashboard → Data → users table
2. Your user should have `role: "admin"`
3. Try creating a product again - it should work!

## Why This Happens
- When you first sign up, you're created as a "customer" by default
- Admin operations require the "admin" role
- You need to manually promote yourself to admin for the first time
- After that, you can manage other admins through the system

## Important Notes
- Only do this ONCE for your account
- Keep your admin credentials secure
- You can promote other users to admin later through the Convex dashboard

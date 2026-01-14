# Admin Dashboard Documentation

## Overview

A comprehensive, professional admin dashboard for MON Bridal & Events with full dark/light mode support, sidebar navigation, and multiple management pages.

## Features

### 🎨 Design Features
- **Dark/Light Mode**: Seamless theme switching with next-themes
- **Responsive Sidebar**: Collapsible on mobile with smooth animations
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Professional Charts**: Analytics powered by Recharts
- **Gradient Cards**: Beautiful gradient backgrounds for stat cards

### 📊 Dashboard Pages

#### 1. **Dashboard Overview** (`/admin`)
- Key metrics at a glance
- Quick stats cards with trend indicators
- Inventory, order, and hire request summaries
- Quick action buttons to navigate to other pages

#### 2. **Products Management** (`/admin/products`)
- Full product CRUD operations
- Product statistics (total, active, jewelry, decor)
- Integrated with existing AdminProductsTab component
- Category-based filtering

#### 3. **Orders Management** (`/admin/orders`)
- Order tracking and status management
- Revenue overview and analytics
- Order status breakdown (pending, processing, completed)
- Average order value calculations
- Integrated with existing AdminOrdersTab component

#### 4. **Stock Management** (`/admin/stock`)
- Real-time inventory monitoring
- Low stock alerts (items below 5 units)
- Out of stock tracking
- Search functionality for products
- Visual stock level indicators
- Category-based inventory breakdown

#### 5. **Analytics Dashboard** (`/admin/analytics`)
- **Revenue Trend Chart**: Area chart showing 6-month revenue trend
- **Sales & Orders Chart**: Bar chart comparing sales and order volume
- **Product Distribution**: Pie chart showing category breakdown
- **Order Status Distribution**: Pie chart for order pipeline
- Performance metrics and KPIs
- Conversion rate tracking
- Average order value analysis

#### 6. **Settings** (`/admin/settings`)
- Notification preferences
- Email and order alerts
- Low stock alert configuration
- Store information management
- Security settings
- System configuration
- Maintenance mode toggle
- Theme customization

## Installation

### Required Dependencies

Install the following packages:

```bash
npm install recharts @radix-ui/react-separator @radix-ui/react-scroll-area
```

These packages are needed for:
- `recharts`: Chart components for analytics
- `@radix-ui/react-separator`: UI separators
- `@radix-ui/react-scroll-area`: Scrollable areas

## File Structure

```
app/admin/
├── layout.tsx              # Admin layout with sidebar and auth
├── page.tsx                # Dashboard overview
├── products/
│   └── page.tsx           # Products management
├── orders/
│   └── page.tsx           # Orders management
├── stock/
│   └── page.tsx           # Stock/inventory management
├── analytics/
│   └── page.tsx           # Analytics with charts
└── settings/
    └── page.tsx           # Settings and configuration

components/admin/
├── AdminSidebar.tsx        # Sidebar navigation component
├── AdminProductsTab.tsx    # Existing products tab
├── AdminOrdersTab.tsx      # Existing orders tab
└── AdminHireRequestsTab.tsx # Existing hire requests tab
```

## Navigation Structure

The sidebar includes the following navigation items:

1. **Dashboard** - Overview and quick stats
2. **Products** - Product catalog management
3. **Orders** - Order tracking and fulfillment
4. **Stock** - Inventory monitoring
5. **Analytics** - Business insights and charts
6. **Settings** - System configuration

## Theme Support

The dashboard fully supports dark and light modes:

- Theme toggle button in sidebar footer
- All charts adapt to theme colors
- Consistent color scheme across all pages
- Gradient cards with theme-aware colors

## Color Scheme

### Stat Cards
- **Violet/Purple**: Products and revenue metrics
- **Emerald/Green**: Orders and success metrics
- **Amber/Orange**: Hire requests and warnings
- **Rose/Pink**: Revenue and featured metrics

### Status Badges
- **Yellow**: Pending status
- **Blue**: Processing status
- **Green**: Completed/Success status
- **Red**: Out of stock/Critical alerts

## Charts & Analytics

### Chart Types Used

1. **Area Chart**: Revenue trend over time
2. **Bar Chart**: Sales and order volume comparison
3. **Pie Charts**: Distribution breakdowns (products, orders)

### Chart Features
- Responsive design
- Theme-aware colors
- Interactive tooltips
- Custom gradients
- Legend support

## Security

- Admin-only access with role-based authentication
- Clerk integration for user management
- Convex backend for secure data handling
- Protected routes with automatic redirects
- Session management

## Mobile Responsiveness

- Collapsible sidebar on mobile devices
- Touch-friendly navigation
- Responsive grid layouts
- Optimized chart displays
- Mobile-first design approach

## Usage

### Accessing the Dashboard

1. Navigate to `/admin`
2. Must be logged in with admin role
3. Sidebar automatically appears on desktop
4. Use hamburger menu on mobile

### Managing Products

1. Go to **Products** page
2. View product statistics
3. Use existing AdminProductsTab for CRUD operations
4. Monitor category distribution

### Tracking Orders

1. Go to **Orders** page
2. View order status breakdown
3. Monitor revenue metrics
4. Manage orders through AdminOrdersTab

### Monitoring Stock

1. Go to **Stock** page
2. View low stock alerts
3. Search for specific products
4. Monitor inventory levels
5. Track out-of-stock items

### Viewing Analytics

1. Go to **Analytics** page
2. Review revenue trends
3. Analyze sales performance
4. Check product distribution
5. Monitor order pipeline

### Configuring Settings

1. Go to **Settings** page
2. Toggle notifications
3. Update store information
4. Configure security options
5. Adjust system settings

## Customization

### Adding New Pages

1. Create new folder in `app/admin/`
2. Add `page.tsx` file
3. Update sidebar links in `AdminSidebar.tsx`
4. Follow existing page structure

### Modifying Charts

Charts are built with Recharts. To customize:

1. Edit chart data in respective page
2. Adjust colors in COLORS array
3. Modify chart types as needed
4. Update responsive container heights

### Styling

- Uses Tailwind CSS utility classes
- shadcn/ui component library
- Custom gradients for cards
- Theme variables in globals.css

## Best Practices

1. **Performance**: Charts only render when data is available
2. **Loading States**: Show loading indicators while fetching data
3. **Error Handling**: Toast notifications for user feedback
4. **Accessibility**: Proper labels and ARIA attributes
5. **Responsive**: Mobile-first approach

## Future Enhancements

Potential additions:
- Export data to CSV/PDF
- Advanced filtering options
- Real-time notifications
- Custom date range selectors
- More chart types
- Bulk operations
- Advanced search
- User management page
- Activity logs

## Support

For issues or questions:
1. Check Convex API endpoints
2. Verify admin role in Clerk
3. Ensure all dependencies are installed
4. Check browser console for errors

---

**Built with**: Next.js 16, React 19, Convex, Clerk, Tailwind CSS, shadcn/ui, Recharts

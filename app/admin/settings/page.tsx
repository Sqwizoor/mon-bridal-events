"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  Globe,
  Save,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your admin preferences and system configuration
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates for important events
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="order-notifications">Order Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new orders are placed
                </p>
              </div>
              <Switch
                id="order-notifications"
                checked={orderNotifications}
                onCheckedChange={setOrderNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts when products are running low
                </p>
              </div>
              <Switch
                id="low-stock-alerts"
                checked={lowStockAlerts}
                onCheckedChange={setLowStockAlerts}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Store Information
            </CardTitle>
            <CardDescription>
              Update your store details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="store-name">Store Name</Label>
              <Input
                id="store-name"
                placeholder="MON Bridal & Events"
                defaultValue="MON Bridal & Events"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="store-email">Contact Email</Label>
              <Input
                id="store-email"
                type="email"
                placeholder="contact@monbridal.com"
                defaultValue="contact@monbridal.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="store-phone">Phone Number</Label>
              <Input
                id="store-phone"
                type="tel"
                placeholder="+27 XX XXX XXXX"
                defaultValue="+27 XX XXX XXXX"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="store-address">Business Address</Label>
              <Input
                id="store-address"
                placeholder="123 Main Street, City, Country"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Privacy
            </CardTitle>
            <CardDescription>
              Manage security settings and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically log out after 30 minutes of inactivity
                </p>
              </div>
              <Badge variant="secondary">30 min</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>API Access</Label>
                <p className="text-sm text-muted-foreground">
                  Manage API keys and integrations
                </p>
              </div>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              Advanced system configuration options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the store for maintenance
                </p>
              </div>
              <Switch
                id="maintenance-mode"
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>
            <div className="space-y-2">
              <Label>Low Stock Threshold</Label>
              <Input
                type="number"
                placeholder="5"
                defaultValue="5"
              />
              <p className="text-sm text-muted-foreground">
                Products below this quantity will trigger low stock alerts
              </p>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Input
                placeholder="ZAR"
                defaultValue="ZAR"
                disabled
              />
              <p className="text-sm text-muted-foreground">
                South African Rand (R)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark mode using the sidebar button
              </p>
            </div>
            <div className="space-y-2">
              <Label>Sidebar Position</Label>
              <div className="flex gap-2">
                <Badge variant="default">Left</Badge>
                <Badge variant="outline">Right</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="cursor-pointer">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

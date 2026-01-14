"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, Package, CreditCard } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-blue-500" },
  { value: "processing", label: "Processing", color: "bg-indigo-500" },
  { value: "shipped", label: "Shipped", color: "bg-purple-500" },
  { value: "delivered", label: "Delivered", color: "bg-green-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-gray-500" },
  { value: "refunded", label: "Refunded", color: "bg-red-500" },
];

const PAYMENT_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "paid", label: "Paid", color: "bg-green-500" },
  { value: "failed", label: "Failed", color: "bg-red-500" },
  { value: "refunded", label: "Refunded", color: "bg-gray-500" },
];

export default function AdminOrdersTab() {
  const orders = useQuery(api.orders.getAll, {});
  const updateStatus = useMutation(api.orders.updateStatus);
  const updatePaymentStatus = useMutation(api.orders.updatePaymentStatus);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleStatusChange = async (
    orderId: Id<"orders">,
    status: string
  ) => {
    try {
      await updateStatus({ id: orderId, status: status as any });
      toast.success("Order status updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handlePaymentStatusChange = async (
    orderId: Id<"orders">,
    paymentStatus: string
  ) => {
    try {
      await updatePaymentStatus({ id: orderId, paymentStatus: paymentStatus as any });
      toast.success("Payment status updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update payment status");
    }
  };

  const getStatusBadge = (status: string, statuses: typeof ORDER_STATUSES) => {
    const statusConfig = statuses.find((s) => s.value === status);
    return (
      <Badge className={statusConfig?.color || "bg-gray-500"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const filteredOrders = orders?.filter(
    (order) => filterStatus === "all" || order.status === filterStatus
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage customer orders and payments</CardDescription>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              {ORDER_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders?.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-sm">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {order.items.length} item(s)
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      R{order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(val) =>
                          handleStatusChange(order._id, val)
                        }
                      >
                        <SelectTrigger className="w-[130px] h-8">
                          {getStatusBadge(order.status, ORDER_STATUSES)}
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.paymentStatus}
                        onValueChange={(val) =>
                          handlePaymentStatusChange(order._id, val)
                        }
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          {getStatusBadge(order.paymentStatus, PAYMENT_STATUSES)}
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Order Details Dialog */}
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Order #{selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Order Date:</span>
                    <p className="font-medium">
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p>{getStatusBadge(selectedOrder.status, ORDER_STATUSES)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payment:</span>
                    <p>
                      {getStatusBadge(
                        selectedOrder.paymentStatus,
                        PAYMENT_STATUSES
                      )}
                    </p>
                  </div>
                  {selectedOrder.paymentId && (
                    <div>
                      <span className="text-muted-foreground">Payment ID:</span>
                      <p className="font-mono text-xs">
                        {selectedOrder.paymentId}
                      </p>
                    </div>
                  )}
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.province}
                      </p>
                      <p>
                        {selectedOrder.shippingAddress.postalCode},{" "}
                        {selectedOrder.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted rounded-md"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                            {item.color && ` • ${item.color}`}
                            {item.size && ` • ${item.size}`}
                          </p>
                        </div>
                        <p className="font-medium">
                          R{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.tax && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VAT (15%)</span>
                      <span>R{selectedOrder.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.shippingCost !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {selectedOrder.shippingCost === 0
                          ? "Free"
                          : `R${selectedOrder.shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                  )}
                  {selectedOrder.discount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-R{selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>R{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Customer Notes</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

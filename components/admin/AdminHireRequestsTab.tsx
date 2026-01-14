"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Eye, Calendar, CheckCircle } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

const HIRE_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "quoted", label: "Quoted", color: "bg-blue-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-500" },
  { value: "completed", label: "Completed", color: "bg-gray-500" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

export default function AdminHireRequestsTab() {
  const hireRequests = useQuery(api.hireRequests.getAll, {});
  const updateStatus = useMutation(api.hireRequests.updateStatus);
  const markDepositPaid = useMutation(api.hireRequests.markDepositPaid);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [quotedAmount, setQuotedAmount] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState<string>("");

  const handleStatusChange = async (
    requestId: Id<"hireRequests">,
    status: string
  ) => {
    try {
      const updates: any = { id: requestId, status: status as any };
      
      if (status === "quoted" && quotedAmount) {
        updates.quotedAmount = parseFloat(quotedAmount);
      }
      
      if (adminNotes) {
        updates.adminNotes = adminNotes;
      }

      await updateStatus(updates);
      toast.success("Request status updated!");
      setSelectedRequest(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleMarkDepositPaid = async (requestId: Id<"hireRequests">) => {
    try {
      await markDepositPaid({ id: requestId });
      toast.success("Deposit marked as paid!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update deposit status");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = HIRE_STATUSES.find((s) => s.value === status);
    return (
      <Badge className={statusConfig?.color || "bg-gray-500"}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const filteredRequests = hireRequests?.filter(
    (request) => filterStatus === "all" || request.status === filterStatus
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openRequestDetails = (request: any) => {
    setSelectedRequest(request);
    setQuotedAmount(request.quotedAmount?.toString() || request.estimatedTotal.toString());
    setAdminNotes(request.adminNotes || "");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Hire Requests</CardTitle>
            <CardDescription>
              Manage decor hire quote requests and bookings
            </CardDescription>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              {HIRE_STATUSES.map((status) => (
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
                <TableHead>Request Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Est. Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No hire requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests?.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell className="text-sm">
                      {formatTimestamp(request.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {request.guestName || "Registered User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.guestEmail || "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(request.eventDate)}
                        </span>
                      </div>
                      {request.eventType && (
                        <p className="text-xs text-muted-foreground">
                          {request.eventType}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {request.items.length} item(s)
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      R{request.estimatedTotal.toFixed(2)}
                      {request.quotedAmount && request.quotedAmount !== request.estimatedTotal && (
                        <p className="text-xs text-green-600">
                          Quoted: R{request.quotedAmount.toFixed(2)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {request.depositPaid ? (
                        <Badge className="bg-green-500">Paid</Badge>
                      ) : (
                        <Badge variant="outline">Unpaid</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openRequestDetails(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "quoted" && !request.depositPaid && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600"
                            onClick={() => handleMarkDepositPaid(request._id)}
                            title="Mark deposit as paid"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Request Details Dialog */}
        <Dialog
          open={!!selectedRequest}
          onOpenChange={() => setSelectedRequest(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Hire Request Details</DialogTitle>
              <DialogDescription>
                Review and respond to this hire request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="text-sm space-y-1 bg-muted p-3 rounded-md">
                      <p>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {selectedRequest.guestName || "Registered User"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {selectedRequest.guestEmail || "-"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {selectedRequest.guestPhone || "-"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Event Details</h4>
                    <div className="text-sm space-y-1 bg-muted p-3 rounded-md">
                      <p>
                        <span className="text-muted-foreground">Date:</span>{" "}
                        {formatDate(selectedRequest.eventDate)}
                      </p>
                      {selectedRequest.eventEndDate && (
                        <p>
                          <span className="text-muted-foreground">End Date:</span>{" "}
                          {formatDate(selectedRequest.eventEndDate)}
                        </p>
                      )}
                      <p>
                        <span className="text-muted-foreground">Type:</span>{" "}
                        {selectedRequest.eventType || "-"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Venue:</span>{" "}
                        {selectedRequest.venue || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items Requested */}
                <div>
                  <h4 className="font-medium mb-2">Items Requested</h4>
                  <div className="space-y-2">
                    {selectedRequest.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted rounded-md"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × R{item.hirePrice.toFixed(2)}/day
                          </p>
                        </div>
                        <p className="font-medium">
                          R{(item.hirePrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Message */}
                {selectedRequest.message && (
                  <div>
                    <h4 className="font-medium mb-2">Customer Message</h4>
                    <p className="text-sm bg-muted p-3 rounded-md">
                      {selectedRequest.message}
                    </p>
                  </div>
                )}

                {/* Pricing */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Estimated Total</span>
                    <span>R{selectedRequest.estimatedTotal.toFixed(2)}</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="quotedAmount">Quoted Amount (R)</Label>
                      <Input
                        id="quotedAmount"
                        type="number"
                        step="0.01"
                        value={quotedAmount}
                        onChange={(e) => setQuotedAmount(e.target.value)}
                        placeholder="Enter final quote amount"
                      />
                    </div>

                    <div>
                      <Label htmlFor="adminNotes">Admin Notes</Label>
                      <Textarea
                        id="adminNotes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Internal notes about this request"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Update Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {HIRE_STATUSES.map((status) => (
                      <Button
                        key={status.value}
                        variant={
                          selectedRequest.status === status.value
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          handleStatusChange(selectedRequest._id, status.value)
                        }
                        className={
                          selectedRequest.status === status.value
                            ? status.color
                            : ""
                        }
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Deposit Status */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div>
                    <h4 className="font-medium">Deposit Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.depositPaid
                        ? "Customer has paid the deposit"
                        : "Deposit not yet received"}
                    </p>
                  </div>
                  {!selectedRequest.depositPaid && (
                    <Button
                      onClick={() => handleMarkDepositPaid(selectedRequest._id)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark Deposit Paid
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

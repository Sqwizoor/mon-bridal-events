"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Calendar, MapPin, Users, MoreHorizontal, MessageSquare, Check, Archive, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function InquiriesPage() {
  const inquiries = useQuery(api.inquiries.get, {});
  // Optional: Add stats query if you create one in convex/inquiries.ts
  const updateStatus = useMutation(api.inquiries.updateStatus);
  
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [adminReply, setAdminReply] = useState("");

  const handleStatusUpdate = async (id: any, status: any) => {
    try {
      await updateStatus({ id, status });
      toast.success(`Inquiry marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">New</Badge>;
      case "read":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Read</Badge>;
      case "replied":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Replied</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold tracking-tight">Booking Inquiries</h1>
          <p className="text-muted-foreground mt-1">
            Manage event booking requests and general inquiries
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <CardDescription>
            A list of all booking requests and contact form submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Details</TableHead>
                <TableHead>Event Info</TableHead>
                <TableHead className="hidden md:table-cell">Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries === undefined ? (
                // Loading Skeleton
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-10 w-32 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-10 w-24 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="h-10 w-48 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 w-16 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-6 w-20 bg-gray-100 rounded animate-pulse" /></TableCell>
                    <TableCell><div className="h-8 w-8 bg-gray-100 rounded animate-pulse ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No inquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow key={inquiry._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{inquiry.name}</span>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="h-3 w-3 mr-1" />
                            {inquiry.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="w-fit">
                          {inquiry.eventType || inquiry.subject || "General"}
                        </Badge>
                        {inquiry.eventDate && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {inquiry.eventDate}
                          </div>
                        )}
                        {inquiry.venue && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1" />
                            {inquiry.venue}
                          </div>
                        )}
                        {inquiry.guestCount && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Users className="h-3 w-3 mr-1" />
                            {inquiry.guestCount} guests
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs">
                      <p className="truncate text-sm text-muted-foreground" title={inquiry.message}>
                        {inquiry.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(inquiry.status)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                       {new Date(inquiry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => { setSelectedInquiry(inquiry); setIsReplyOpen(true); }}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry._id, "read")}>
                            <Clock className="mr-2 h-4 w-4" />
                            Mark as Read
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry._id, "replied")}>
                            <Check className="mr-2 h-4 w-4" />
                            Mark as Replied
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(inquiry._id, "closed")}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              From {selectedInquiry?.name} ({selectedInquiry?.email})
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Event Type</h4>
                  <p>{selectedInquiry.eventType || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Date</h4>
                  <p>{selectedInquiry.eventDate ? new Date(selectedInquiry.eventDate).toLocaleDateString("en-US", { dateStyle: "long" }) : "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Venue</h4>
                  <p>{selectedInquiry.venue || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Guest Count</h4>
                  <p>{selectedInquiry.guestCount || "N/A"}</p>
                </div>
                 <div>
                  <h4 className="font-medium text-muted-foreground mb-1">Phone</h4>
                  <p>{selectedInquiry.phone || "N/A"}</p>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Message:</h4>
                <p className="text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Internal Notes / Status Update</h4>
                <Textarea 
                  placeholder="Coming soon: Add internal notes here..."
                  disabled
                />
                 <div className="flex gap-2 mt-2">
                   <Button size="sm" variant="outline" onClick={() => {
                        window.location.href = `mailto:${selectedInquiry.email}?subject=Re: ${selectedInquiry.subject || "Your Inquiry"}`;
                   }}>
                     <Mail className="mr-2 h-4 w-4" />
                     Reply via Email
                   </Button>
                   <Button size="sm" onClick={() => {
                       handleStatusUpdate(selectedInquiry._id, "replied");
                       setIsReplyOpen(false);
                   }}>
                     Mark Replied & Close
                   </Button>
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

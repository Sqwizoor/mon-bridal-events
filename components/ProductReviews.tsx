"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface ProductReviewsProps {
  productId: Id<"products">;
  productName: string;
}

export default function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const reviews = useQuery(api.reviews.getByProduct, { productId });
  const createReview = useMutation(api.reviews.create);
  const { user, isLoaded, isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        productId,
        rating,
        title: reviewTitle,
        content: reviewContent,
      });
      toast.success("Review submitted successfully!");
      setRating(0);
      setReviewTitle("");
      setReviewContent("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t">
      <h2 className="text-2xl font-serif font-bold mb-8">Customer Reviews</h2>

      <div className="grid md:grid-cols-3 gap-12">
        {/* Review List */}
        <div className="md:col-span-2 space-y-8">
          {reviews === undefined ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <div className="min-h-[200px] flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl text-center">
              <Star className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="font-medium text-lg text-gray-900">No reviews yet</h3>
              <p className="text-gray-500 mt-1">Be the first to review {productName}</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="pb-8 border-b last:border-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={review.authorAvatar ? `/storage/${review.authorAvatar}` : undefined} />
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-bold">
                        {review.authorName?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-semibold text-gray-900">{review.authorName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3 w-3 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-bold text-gray-900 mb-2 text-sm">{review.title}</h4>
                )}
                
                <p className="text-gray-600 leading-relaxed text-sm">
                  {review.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Write Review Form */}
        <div className="bg-gray-50 p-6 rounded-xl h-fit sticky top-24">
          <h3 className="font-bold text-lg mb-4">Write a Review</h3>
          
          {!isLoaded ? (
             <div className="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
          ) : !isSignedIn ? (
             <div className="text-center py-8">
               <p className="text-gray-500 mb-4">Please sign in to leave a review</p>
               <Button asChild className="w-full">
                 <a href="/sign-in">Sign In</a>
               </Button>
             </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none transition-transform hover:scale-110"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          star <= (hoverRating || rating) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'fill-transparent text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1.5">Title</label>
                <Input
                  id="title"
                  placeholder="Summary of your experience"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="bg-white"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1.5">Review</label>
                <Textarea
                  id="content"
                  placeholder="Tell us more about your thoughts..."
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  required
                  className="min-h-[100px] bg-white"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

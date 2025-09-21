'use client';

import { format } from "date-fns";
import { Lightbulb, Loader2, Heart, MessageCircle, Eye, Share2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  authorImage: string;
  published: string;
  image: string;
  tags: string[];
  category: string;
  visibility: boolean;
  featured: boolean;
  readTime: number;
  views: number;
  likes: number;
  comments: Array<{
    user: string;
    comment: string;
    createdAt: string;
  }>;
}

interface Comment {
  user: string;
  comment: string;
  createdAt: string;
}

const BlogPost = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, find the blog by slug to get the ID
      const slugResponse = await fetch(`/api/blogs?slug=${slug}`);
      if (!slugResponse.ok) {
        if (slugResponse.status === 404) {
          throw new Error('Blog not found');
        }
        throw new Error('Failed to fetch blog');
      }

      const slugData = await slugResponse.json();
      if (!slugData.blog) {
        throw new Error('Blog not found');
      }

      const blogId = slugData.blog._id;

      // Then fetch the full blog data (this will increment views)
      const response = await fetch(`/api/blogs/${blogId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog details');
      }

      const data = await response.json();
      setBlog(data.blog);
      setLikesCount(data.blog.likes);
      setComments(data.blog.comments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!blog) return;

    try {
      const method = liked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/blogs/${blog._id}/like`, {
        method,
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }

      const data = await response.json();
      setLikesCount(data.likes);
      setLiked(!liked);
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !newComment.trim() || !commentAuthor.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await fetch(`/api/blogs/${blog._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: commentAuthor.trim(),
          comment: newComment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      setComments(prev => [...prev, data.comment]);
      setNewComment("");
      setCommentAuthor("");
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <section className="py-32">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Loading blog post...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className="py-32">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <Alert className="max-w-md">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Blog Not Found</AlertTitle>
              <AlertDescription>
                {error || "The blog post you're looking for doesn't exist."}
              </AlertDescription>
            </Alert>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">{blog.category}</Badge>
              {blog.featured && <Badge variant="secondary">Featured</Badge>}
            </div>

            <h1 className="max-w-3xl text-pretty text-5xl font-semibold md:text-6xl">
              {blog.title}
            </h1>

            <h3 className="text-muted-foreground max-w-3xl text-lg md:text-xl">
              {blog.summary}
            </h3>

            <div className="flex items-center gap-3 text-sm md:text-base">
              <Avatar className="h-8 w-8 border">
                <AvatarImage src={blog.authorImage} />
                <AvatarFallback>{blog.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>
                <span className="font-semibold">{blog.author}</span>
                <span className="ml-1">on {format(new Date(blog.published), "MMMM d, yyyy")}</span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {blog.views} views
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {likesCount} likes
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {comments.length} comments
              </span>
              <span>{blog.readTime} min read</span>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button
                variant={liked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="mb-8 mt-4 w-full relative aspect-video rounded-lg border overflow-hidden">
              <Image
                src={blog.image || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>

            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="container mt-16">
          <div className="prose dark:prose-invert mx-auto max-w-3xl">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold mb-8">Comments ({comments.length})</h2>

            {/* Add Comment Form */}
            <Card className="mb-8">
              <CardHeader>
                <h3 className="text-lg font-semibold">Leave a Comment</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleComment} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Write your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submittingComment}>
                    {submittingComment ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post Comment'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {comment.user.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{comment.user}</span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                          <p className="text-muted-foreground">{comment.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPost;
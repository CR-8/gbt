'use client';

import { ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BlogPost {
  _id: string;
  title: string;
  summary: string;
  author: string;
  published: string;
  slug: string;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
  readTime: number;
  views: number;
  likes: number;
}

interface BlogsResponse {
  blogs: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 0,
  });

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/blogs?page=${page}&limit=9`);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }

      const data: BlogsResponse = await response.json();
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-32">
        <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              Latest Updates
            </Badge>
            <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
              Blog Posts
            </h2>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
              Discover the latest trends, tips, and best practices in modern web development.
            </p>
          </div>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading blogs...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-32">
        <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6">
              Latest Updates
            </Badge>
            <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
              Blog Posts
            </h2>
            <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
              Discover the latest trends, tips, and best practices in modern web development.
            </p>
            <div className="text-red-500 mb-4">
              Error loading blogs: {error}
            </div>
            <Button onClick={() => fetchBlogs()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32">
      <div className="container mx-auto flex flex-col items-center gap-16 lg:px-16">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Latest Updates
          </Badge>
          <h2 className="mb-3 text-3xl font-semibold text-pretty md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
            Blog Posts
          </h2>
          <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
            Discover the latest trends, tips, and best practices in modern web development. From UI components to design systems, stay updated with our expert insights.
          </p>
          <Button variant="link" className="w-full sm:w-auto" asChild>
            <a href="https://shadcnblocks.com" target="_blank">
              View all articles
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No blog posts found.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {blogs.map((post) => (
                <Card
                  key={post._id}
                  className="grid grid-rows-[auto_auto_1fr_auto] pt-0"
                >
                  <div className="aspect-16/9 w-full relative overflow-hidden">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="transition-opacity duration-200 fade-in hover:opacity-70"
                    >
                      <Image
                        src={post.image || "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg"}
                        alt={post.title}
                        fill
                        className="object-cover object-center"
                      />
                    </Link>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      {post.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold hover:underline md:text-xl">
                      <Link href={`/blogs/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{post.summary}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.published).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="flex items-center text-foreground hover:underline"
                    >
                      Read more
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>👁️ {post.views}</span>
                      <span>❤️ {post.likes}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchBlogs(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => fetchBlogs(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Blogs;

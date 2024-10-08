import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { Post } from "@/types";
import haveCommonElements from "./haveCommonElements";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string): Post | null {
  const realSlug = slug?.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return { ...data, slug: realSlug, content } as Post;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // Handle the case where the file is not found
      console.error(`File not found: ${fullPath}`);
      return null;
    } else {
      // Rethrow the error if it's not a file not found error
      throw error;
    }
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null) // Filter out null posts
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getPostsByWriter(writer: string): Post[] {
  const allPosts = getAllPosts();
  const writerPosts = allPosts.filter((post) =>
    post.writers?.includes(writer)
  );
  return writerPosts;
}

export function getPostsByTags(tags: string[]): Post[] {
  const allPosts = getAllPosts();
  const taggedPosts = allPosts.filter((post) =>
    // checks if post's tags and given tags matches have common elements
    haveCommonElements(post.tags, tags)
  );
  return taggedPosts;
}

export function getPostsByDateRange(startDate: string, endDate: string): Post[] {
  const allPosts = getAllPosts();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const dateRangePosts = allPosts.filter((post) => {
    const postDate = new Date(post.date);
    return postDate >= start && postDate <= end;
  });

  return dateRangePosts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}

export function getAllWriters(): string[] {
  const posts = getAllPosts();
  const writers = new Set<string>();

  posts.forEach((post) => {
    post.writers?.forEach((writer) => writers.add(writer));
  });

  return Array.from(writers);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.tags?.forEach((writer) => tags.add(writer));
  });

  return Array.from(tags);
}

export function getAllTitles(): string[] {
  const posts = getAllPosts();
  const titles = new Set<string>();

  posts.forEach((post) => {
    titles.add(post.title);
  });

  return Array.from(titles);
}
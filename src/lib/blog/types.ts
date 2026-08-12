export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
  content: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

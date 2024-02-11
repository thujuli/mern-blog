interface PostForm {
  title: string;
  content: string;
  category?: string;
  imageUrl?: string;
}

interface PostData {
  userId: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  slug: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PostsResponse {
  posts: PostData[];
  totalLastMonthPosts: number;
  totalPosts: number;
}

export type { PostForm, PostData, PostsResponse };

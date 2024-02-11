interface PostForm {
  title: string;
  content: string;
  category?: string;
  imageUrl?: string;
}

interface PostResponse {
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

export type { PostForm, PostResponse };

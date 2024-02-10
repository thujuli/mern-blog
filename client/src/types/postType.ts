interface PostForm {
  title: string;
  content: string;
  categories?: string;
  postImage?: string;
}

interface PostResponse {
  userId: string;
  title: string;
  categories: string;
  content: string;
  postImage: string;
  slug: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type { PostForm, PostResponse };

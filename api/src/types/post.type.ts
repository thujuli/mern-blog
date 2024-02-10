interface IPost {
  userId: string;
  title: string;
  categories: string;
  postImage: string;
  content: string;
  slug: string;
}

interface PostRequest {
  title: string | null;
  categories: string | null;
  postImage: string | null;
  content: string | null;
}

export type { IPost, PostRequest };

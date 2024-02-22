interface CommentForm {
  content: string;
  postId: string;
}

interface CommentData {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes: string[];
  numberOfLikes: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type { CommentForm, CommentData };

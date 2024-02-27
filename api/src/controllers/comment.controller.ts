import { NextFunction, Request, Response } from "express";
import createCustomError from "../utils/error";
import Comment from "../models/comment.model";
import Post from "../models/post.model";

const commentCreate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content, postId } = req.body;
  if (!content || !postId) {
    return next(createCustomError(400, "All fields are required!"));
  }

  try {
    await Post.findById(postId);
  } catch (error) {
    if (error.name === "CastError") {
      return next(createCustomError(404, "Post not found"));
    } else {
      if (error instanceof Error) {
        console.error("Comment create error:", error.message);
      }
      return next(createCustomError(500, "Internal server error"));
    }
  }

  const newComment = new Comment({
    content,
    postId,
    userId: res.locals.user.id,
  });
  try {
    await newComment.save();
    res.json(newComment);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Comment create error:", error.message);
    }
    next(createCustomError(500, "Internal server error"));
  }
};

const commentLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const userIndex = comment.likes.indexOf(res.locals.user.id);

    if (userIndex === -1) {
      comment.likes.push(res.locals.user.id);
      comment.numberOfLikes++;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.numberOfLikes--;
    }
    await comment.save();
    res.json(comment);
  } catch (error) {
    if (error.name === "CastError") {
      return next(createCustomError(404, "Comment not found"));
    } else {
      if (error instanceof Error) {
        console.error("Comment like error", error.message);
      }
      return next(createCustomError(500, "Internal server error"));
    }
  }
};

export { commentCreate, commentLike };

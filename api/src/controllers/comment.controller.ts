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
      console.error("Comment create error:", error);
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
    console.error("Comment create error:", error);
    next(createCustomError(500, "Internal server error"));
  }
};

const commentIndex = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    if (comments.length === 0) {
      return next(createCustomError(404, "Comment not found"));
    }
    res.json(comments);
  } catch (error) {
    console.error("Comment index error:", error);
    next(createCustomError(500, "Internal server error"));
  }
};

export { commentCreate, commentIndex };

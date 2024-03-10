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
    if (error instanceof Error && error.name === "CastError") {
      next(createCustomError(404, "Comment not found"));
    } else {
      if (error instanceof Error) {
        console.error("Comment like error", error.message);
      }
      next(createCustomError(500, "Internal server error"));
    }
  }
};

const commentUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!res.locals.user.isAdmin || res.locals.user.id !== comment.userId) {
      return next(
        createCustomError(403, "You are not allowed to edit this comment")
      );
    }
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return next(createCustomError(404, "Comment not found"));
    } else {
      if (error instanceof Error) {
        console.error("Comment update error:", error.message);
      }
      return next(createCustomError(500, "Internal server error"));
    }
  }

  try {
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );
    res.json(editedComment);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Comment update error:", error.message);
    }
    next(createCustomError(500, "Internal server error"));
  }
};

const commentDestroy = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!res.locals.user.isAdmin) {
      return next(
        createCustomError(403, "You are not allowed to delete this comment")
      );
    }
  } catch (error) {
    if (error instanceof Error && error.name === "CastError") {
      return next(createCustomError(404, "Comment not found"));
    } else {
      if (error instanceof Error) {
        console.error("Comment destroy error:", error.message);
      }
      return next(createCustomError(500, "Internal server error"));
    }
  }

  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: "Comment has been deleted" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Comment destroy error:", error.message);
    }
    next(createCustomError(500, "Internal server error"));
  }
};

const commentIndex = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals.user.isAdmin) {
    return next(
      createCustomError(403, "You are not allowed to access this page")
    );
  }

  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 9;
    const sort = req.query.sort === "asc" ? 1 : -1;

    const comments = await Comment.find()
      .sort({ createdAt: sort })
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments();
    const now = new Date();
    const oneMothAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDay()
    );
    const totalLastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMothAgo },
    });

    res.json({ comments, totalComments, totalLastMonthComments });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Comment index error", error.message);
    }
    next(createCustomError(500, "Internal server error"));
  }
};

export {
  commentCreate,
  commentLike,
  commentUpdate,
  commentDestroy,
  commentIndex,
};

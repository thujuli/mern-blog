import { NextFunction, Request, Response } from "express";
import createCustomError from "../utils/error";
import { PostRequest, PostFields } from "post.type";
import Post from "../models/post.model";
import Comment from "../models/comment.model";

const postCreate = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user.isAdmin) {
    return next(createCustomError(403, "You are not allowed to create a post"));
  }

  const { title, content, category, imageUrl }: PostRequest = req.body;
  const postFields: PostFields = {};
  if (!title || !content) {
    return next(createCustomError(400, "Please provide all required fields"));
  }

  const postTitleExists = await Post.findOne({ title });
  if (postTitleExists) {
    return next(createCustomError(400, "Title already exists"));
  }

  const slug = title
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();
  const postSlugExists = await Post.findOne({ slug });
  if (postSlugExists) {
    return next(
      createCustomError(
        400,
        "Duplicate Slug Detected: Please Modify the 'Title' to Generate a Unique Slug"
      )
    );
  }

  postFields.title = title;
  postFields.content = content;

  if (category) {
    postFields.category = category;
  }
  if (imageUrl) {
    postFields.imageUrl = imageUrl;
  }

  const newPost = new Post({
    ...postFields,
    slug,
    userId: res.locals.user.id,
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Post create error:", error);
    next(createCustomError(500, "Internal server error"));
  }
};

const postIndex = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skip = Number(req.query.skip) || 0;
    const limit = Number(req.query.limit) || 9;
    const sort = req.query.sort === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sort })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMothAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const totalLastMothPosts = await Post.countDocuments({
      createdAt: { $gte: oneMothAgo },
    });

    res.json({ posts, totalPosts, totalLastMothPosts });
  } catch (error) {
    console.error("Post index error:", error);
    next(createCustomError(500, "Internal server error"));
  }
};

const postDestroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!res.locals.user.isAdmin || post.userId !== res.locals.user.id) {
      return next(
        createCustomError(403, "You are not allowed to delete this post")
      );
    }
  } catch (error) {
    if (error.name === "CastError") {
      return next(createCustomError(404, "Post not found"));
    } else {
      console.error("Post destroy error:", error);
      return next(createCustomError(500, "Internal server error"));
    }
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.json({ message: "Post has been deleted" });
  } catch (error) {
    console.error("Post destroy error:", error);
    next(createCustomError(500, "Internal server error"));
  }
};

const postUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!res.locals.user.isAdmin || post.userId !== res.locals.user.id) {
      return next(
        createCustomError(403, "You are not allowed to update this post")
      );
    }
  } catch (error) {
    if (error.name === "CastError") {
      return next(createCustomError(404, "Post not found"));
    } else {
      console.error("Post destroy error:", error);
      return next(createCustomError(500, "Internal server error"));
    }
  }

  const { title, content, category, imageUrl }: PostRequest = req.body;
  const postFields: PostFields = {};

  if (title) {
    const postTitleExists = await Post.findOne({ title });
    if (
      postTitleExists &&
      postTitleExists.title === title &&
      postTitleExists.userId !== res.locals.user.id
    ) {
      return next(createCustomError(400, "Title already exists"));
    }
    postFields.title = title;
  }

  if (content) {
    postFields.content = content;
  }

  if (category) {
    postFields.category = category;
  }

  if (imageUrl) {
    postFields.imageUrl = imageUrl;
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: postFields },
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    console.error("Post update error:", error);
    next(createCustomError(500, "Internal server error"));
  }
};

const postComments = async (
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
    console.error("Post commets error:", error);
    next(createCustomError(500, "Internal server error"));
  }
};

export { postCreate, postIndex, postDestroy, postUpdate, postComments };

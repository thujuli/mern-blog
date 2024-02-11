import { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/error";
import { PostRequest, PostFields } from "post.type";
import Post from "../models/post.model";

const postCreate = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  const { title, content, category, imageUrl }: PostRequest = req.body;
  const postFields: PostFields = {};
  if (!title || !content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const postTitleExists = await Post.findOne({ title });
  if (postTitleExists) {
    return next(errorHandler(400, "Title already exists"));
  }

  const slug = title
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();
  const postSlugExists = await Post.findOne({ slug });
  if (postSlugExists) {
    return next(
      errorHandler(
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
    next(errorHandler(500, "Internal server error"));
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
      .sort({ updateAt: sort })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMothAgo = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate()
    );
    const totalLastMothPosts = await Post.countDocuments({
      createdAt: { $gte: oneMothAgo },
    });

    res.json({ posts, totalPosts, totalLastMothPosts });
  } catch (error) {
    console.error("Post index error:", error);
    next(errorHandler(500, "Internal server error"));
  }
};

export { postCreate, postIndex };

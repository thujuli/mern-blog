import { NextFunction, Request, Response } from "express";
import errorHandler from "../utils/error";
import { PostRequest } from "post.type";
import Post from "../models/post.model";

const postCreate = async (req: Request, res: Response, next: NextFunction) => {
  if (!res.locals.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  const { title, content, categories, postImage }: PostRequest = req.body;
  if (!title || !content || !categories) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const slug = title.replace(/ /g, "-").replace(/[^\w-]+/g, "");
  const newPost = new Post({
    categories,
    content,
    postImage,
    slug,
    title,
    userId: res.locals.user.id,
  });

  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    // if (error.name === "MongoServerError" && error.code === 11000) {
    //   next(
    //     errorHandler(
    //       400,
    //       `Title '${title}' already exists. Please choose a different title.`
    //     )
    //   );
    // } else {
    //   next(error);
    // }
  }
};

export { postCreate };

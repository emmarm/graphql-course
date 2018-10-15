import bcrypt from "bcryptjs";

import getUserId from "../utils/getUserId";
import generateToken from "../utils/generateToken";

const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    if (data.password.length < 8) {
      throw new Error("Password must be 8 characters or longer.");
    }

    const password = await bcrypt.hash(data.password, 10);

    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password
      }
    });

    return {
      user,
      token: generateToken(user.id)
    };
  },
  async logIn(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({
      where: {
        email: data.email
      }
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new Error("Unable to log in.");
    }

    return {
      user,
      token: generateToken(user.id)
    };
  },
  updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.mutation.updateUser(
      {
        where: { id: userId },
        data
      },
      info
    );
  },
  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.deleteUser(
      {
        where: { id: userId }
      },
      info
    );
  },
  createPost(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    const { title, body, published, author } = data;
    return prisma.mutation.createPost(
      {
        data: {
          title,
          body,
          published,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
  },
  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });
    const wasPublished = await prisma.exists.Post({
      id,
      published: true
    });

    if (!postExists) {
      throw new Error("Unable to update post.");
    }

    if (wasPublished && !data.published) {
      await prisma.mutation.deleteManyComments({
        where: { post: { id } }
      });
    }

    return prisma.mutation.updatePost(
      {
        data,
        where: { id }
      },
      info
    );
  },
  async deletePost(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error("Unable to delete post.");
    }

    return prisma.mutation.deletePost(
      {
        where: { id }
      },
      info
    );
  },
  async createComment(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: data.post,
      published: true
    });

    if (!postExists) {
      throw new Error("Unable to find post.");
    }

    const { text, post } = data;
    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: post
            }
          }
        }
      },
      info
    );
  },
  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error("Unable to update comment.");
    }

    return prisma.mutation.updateComment(
      {
        data,
        where: { id }
      },
      info
    );
  },
  async deleteComment(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error("Unable to delete comment.");
    }

    return prisma.mutation.deleteComment(
      {
        where: { id }
      },
      info
    );
  }
};

export default Mutation;

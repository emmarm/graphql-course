import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import getUserId from "../utils/getUserId";

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
      token: jwt.sign({ userId: user.id }, "superstrongsecret")
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
      token: jwt.sign({ userId: user.id }, "superstrongsecret")
    };
  },
  updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser(
      {
        where: { id },
        data
      },
      info
    );
  },
  deleteUser(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteUser({ where: { id } }, info);
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
  updatePost(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updatePost({ data, where: { id } }, info);
  },
  deletePost(parent, { id }, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  createComment(parent, { data }, { prisma }, info) {
    return prisma.mutation.createComment(
      {
        data: {
          text: data.text,
          author: {
            connect: {
              id: data.author
            }
          },
          post: {
            connect: {
              id: data.post
            }
          }
        }
      },
      info
    );
  },
  updateComment(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateComment({ data, where: { id } }, info);
  },
  deleteComment(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment({ where: { id } }, info);
  }
};

export default Mutation;

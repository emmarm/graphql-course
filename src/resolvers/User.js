import getUserId from "../utils/getUserId";

const userIdFragment = "fragment userId on User { id }";

const User = {
  email: {
    fragment: userIdFragment,
    resolve({ id, email }, args, { request }, info) {
      const userId = getUserId(request);

      if (userId && userId === id) {
        return email;
      }

      return null;
    }
  },
  posts: {
    fragment: userIdFragment,
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          author: {
            id
          },
          published: true
        }
      });
    }
  }
};

export default User;

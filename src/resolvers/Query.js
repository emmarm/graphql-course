const Query = {
  me() {
    return {
      id: "3662",
      name: "Emma",
      email: "emma@example.com",
      age: 29
    };
  },
  users(parent, { query }, { prisma }, info) {
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            name_contains: query
          },
          {
            email_contains: query
          }
        ]
      };
    }

    return prisma.query.users(opArgs, info);
  },
  post() {
    return {
      id: "1",
      title: "First Post",
      body: "This is the first post",
      published: true,
      author: "3662"
    };
  },
  posts(parent, { query }, { prisma }, info) {
    const opArgs = {};

    if (query) {
      opArgs.where = {
        OR: [
          {
            title_contains: query
          },
          {
            body_contains: query
          }
        ]
      };
    }
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  }
};

export default Query;

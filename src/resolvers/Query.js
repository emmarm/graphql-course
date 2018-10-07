const Query = {
  me() {
    return {
      id: "3662",
      name: "Emma",
      email: "emma@example.com",
      age: 29
    };
  },
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter(user =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
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
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter(post => {
      const query = args.query.toLowerCase();
      const hasTitleMatch = post.title.toLowerCase().includes(query);
      const hasBodyMatch = post.body.toLowerCase().includes(query);
      return hasTitleMatch || hasBodyMatch;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  }
};

export default Query;

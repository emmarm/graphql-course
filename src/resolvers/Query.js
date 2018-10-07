const Query = {
  me() {
    return {
      id: "3662",
      name: "Emma",
      email: "emma@example.com",
      age: 29
    };
  },
  users(parent, { query }, { db }, info) {
    if (!query) {
      return db.users;
    }
    return db.users.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase())
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
  posts(parent, { query }, { db }, info) {
    if (!query) {
      return db.posts;
    }
    return db.posts.filter(post => {
      const q = query.toLowerCase();
      const hasTitleMatch = post.title.toLowerCase().includes(q);
      const hasBodyMatch = post.body.toLowerCase().includes(q);
      return hasTitleMatch || hasBodyMatch;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  }
};

export default Query;

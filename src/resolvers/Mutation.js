import uuidv4 from "uuid/v4";

const Mutation = {
  createUser(parent, { data }, { db }, info) {
    const emailTaken = db.users.some(user => user.email === data.email);

    if (emailTaken) {
      throw new Error("Email already in use");
    }

    const user = {
      id: uuidv4(),
      ...data
    };

    db.users.push(user);
    return user;
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.find(user => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email already in use");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
  deleteUser(parent, { id }, { db }, info) {
    const userIndex = db.users.findIndex(user => user.id === id);

    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter(post => {
      const match = post.author === id;

      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post.id);
      }

      return !match;
    });
    db.comments = db.comments.filter(comment => comment.author !== id);

    return deletedUsers[0];
  },
  createPost(parent, { data }, { db }, info) {
    const authorExists = db.users.some(user => user.id === data.author);

    if (!authorExists) {
      throw new Error("Author not found");
    }

    const post = {
      id: uuidv4(),
      ...data
    };

    db.posts.push(post);
    return post;
  },
  updatePost(parent, { id, data }, { db }, info) {
    const post = db.posts.find(post => post.id === id);

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;
    }

    return post;
  },
  deletePost(parent, { id }, { db }, info) {
    const postIndex = db.posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const deletedPosts = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter(comment => comment.post !== id);

    return deletedPosts[0];
  },
  createComment(parent, { data }, { db }, info) {
    const authorFound = db.users.some(user => user.id === data.author);
    const postFound = db.posts.some(
      post => post.id === data.post && post.published
    );

    if (!authorFound) {
      throw new Error("Comment author not found");
    } else if (!postFound) {
      throw new Error("Post not found");
    }

    const comment = {
      id: uuidv4(),
      ...data
    };

    db.comments.push(comment);

    return comment;
  },
  updateComment(parent, { id, data }, { db }, info) {
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    return comment;
  },
  deleteComment(parent, { id }, { db }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === id);

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const deletedComments = db.comments.splice(commentIndex, 1);
    return deletedComments[0];
  }
};

export default Mutation;

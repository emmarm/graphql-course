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
  createPost(parent, { data }, { db, pubsub }, info) {
    const authorExists = db.users.some(user => user.id === data.author);

    if (!authorExists) {
      throw new Error("Author not found");
    }

    const post = {
      id: uuidv4(),
      ...data
    };

    db.posts.push(post);
    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
    }

    return post;
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find(post => post.id === id);
    const prevPost = { ...post };

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

      if (prevPost.published && !post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: prevPost
          }
        });
      } else if (!prevPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      } else if (post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "UPDATED",
            data: post
          }
        });
      }
    }

    return post;
  },
  deletePost(parent, { id }, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(post => post.id === id);

    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter(comment => comment.post !== id);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post
        }
      });
    }

    return post;
  },
  createComment(parent, { data }, { db, pubsub }, info) {
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

    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });

    return comment;
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });

    return comment;
  },
  deleteComment(parent, { id }, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === id);

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }

    const [comment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "DELETED",
        data: comment
      }
    });

    return comment;
  }
};

export default Mutation;

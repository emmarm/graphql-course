import { GraphQLServer } from "graphql-yoga";

const users = [
  {
    id: "3662",
    name: "Emma",
    email: "emma@example.com",
    age: 29
  },
  {
    id: "33272",
    name: "Debra",
    email: "debra@example.com"
  },
  {
    id: "3742",
    name: "Eric",
    email: "eric@example.com"
  }
];

const posts = [
  {
    id: "1",
    title: "First Post",
    body: "This is the first post",
    published: true,
    author: "3662"
  },
  {
    id: "2",
    title: "Second Post",
    body: "This is the second post",
    published: true,
    author: "3662"
  },
  {
    id: "3",
    title: "Coming Soon",
    body: "This will be amazing",
    published: false,
    author: "33272"
  }
];

const comments = [
  {
    id: "111",
    text: "Great post!",
    author: "33272",
    post: "1"
  },
  {
    id: "222",
    text: "Check out this related post",
    author: "3742",
    post: "1"
  },
  {
    id: "333",
    text: "Cool, thanks for sharing!",
    author: "33272",
    post: "2"
  },
  {
    id: "444",
    text: "Love it!",
    author: "3742",
    post: "2"
  }
];

const typeDefs = `
  type Query {
    me: User!
    users(query: String): [User!]!
    post: Post!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

const resolvers = {
  Query: {
    me() {
      return {
        id: "3662",
        name: "Emma",
        email: "emma@example.com",
        age: 29
      };
    },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user =>
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
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        const query = args.query.toLowerCase();
        const hasTitleMatch = post.title.toLowerCase().includes(query);
        const hasBodyMatch = post.body.toLowerCase().includes(query);
        return hasTitleMatch || hasBodyMatch;
      });
    },
    comments() {
      return comments;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start({ port: 4001 }, ({ port }) =>
  console.log(`Server started on port ${port}`)
);

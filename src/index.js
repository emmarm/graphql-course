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

const typeDefs = `
  type Query {
    hello: String!
    me: User!
    users: [User!]!
    post: Post!
    posts: [Post!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }
`;

const resolvers = {
  Query: {
    hello() {
      return "Hello GraphQL!";
    },
    me() {
      return {
        id: "3662",
        name: "Emma",
        email: "emma@example.com",
        age: 29
      };
    },
    users() {
      return users;
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
    posts() {
      return posts;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => post.author === parent.id);
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

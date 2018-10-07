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

const typeDefs = `
  type Query {
    hello: String!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
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
    post() {
      return {
        id: "1",
        title: "First Post",
        body: "This is the first post",
        published: true,
        author: "3662"
      };
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => user.id === parent.author);
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

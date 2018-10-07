import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    hello: String!
    me: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
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

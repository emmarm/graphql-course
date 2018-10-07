import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello() {
      return "Hello GraphQL!";
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

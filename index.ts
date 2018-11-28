import { typeDefs, resolvers } from "./graphql/user";
import express from 'express';

// GraphQL
import { ApolloServer, gql } from 'apollo-server-express';
const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
);
import express from 'express';

// GraphQL
import { ApolloServer } from 'apollo-server-express';
import { schema } from './graphql/schema';
const server = new ApolloServer({ schema });

const app = express();
server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
);
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// GraphQL
var apollo_server_express_1 = require("apollo-server-express");
var schema_1 = require("./graphql/schema");
var server = new apollo_server_express_1.ApolloServer({ schema: schema_1.schema });
var app = express_1.default();
server.applyMiddleware({ app: app });
var port = 4000;
app.listen({ port: port }, function () {
    return console.log("\uD83D\uDE80 Server ready at http://localhost:" + port + server.graphqlPath);
});

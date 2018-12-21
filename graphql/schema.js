"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_tools_1 = require("graphql-tools");
var user_1 = __importDefault(require("./user"));
var friend_1 = __importDefault(require("./friend"));
var query_1 = __importDefault(require("./query"));
var mutation_1 = __importDefault(require("./mutation"));
exports.schema = graphql_tools_1.makeExecutableSchema({
    typeDefs: [
        user_1.default.typeDefs,
        friend_1.default.typeDefs,
        query_1.default.typeDefs,
        mutation_1.default.typeDefs
    ],
    resolvers: [
        query_1.default.resolvers,
        mutation_1.default.resolvers
    ]
});

import { makeExecutableSchema } from 'graphql-tools';

import User from './user';
import Friend from './friend';
import Query from './query';
import Mutation from './mutation';

export const schema = makeExecutableSchema({
    typeDefs: [
        User.typeDefs,
        Friend.typeDefs,
        Query.typeDefs,
        Mutation.typeDefs
    ],
    resolvers: [
        Query.resolvers,
        Mutation.resolvers
    ]
});
import User from '../class/user';
import Friend from '../class/friend';
import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Query {
        hello: String,
        getusers: [User],
        useridsearch(userid: Int!): User,
        usernamesearch(username: String!): [User],
        usersinpage(page: Int!): [User],
        usersinpagebyid(userid: Int): [User],
        getfollowinglist(userid: Int!): [Friend],
        getfollowerlist(userid: Int!): [Friend]
    }
`;

const resolvers = {
    Query: {
        getusers: () => User.getusers(),
        hello: () => 'Hello world!',
        useridsearch: (_, param) => User.useridsearch(param.userid),
        usernamesearch: (_, param) => User.usernamesearch(param.username),
        usersinpage: (_, param) => User.usersinpage(param.page),
        usersinpagebyid: (_, param) => User.usersinpagebyid(param.userid),
        getfollowinglist: (_, param) => Friend.getfollowinglist(param.userid),
        getfollowerlist: (_, param) => Friend.getfollowerlist(param.userid)
    }
};

export default { typeDefs, resolvers };
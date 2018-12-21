import User from '../class/user';
import Friend from '../class/friend';
import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Mutation {
        createuser(username: String): User,
        updateuser(userid: Int, username: String): User,
        followuser(userid: Int, friendid: Int): String,
        unfollowuser(userid: Int, friendid: Int): String
    }
`;

const resolvers = {
    Mutation: {
        createuser: (_, input) => User.createuser(input.username),
        updateuser: (_, input) => User.updateuser(input.userid, input.username),
        followuser: (_, input) => Friend.followuser(input.userid, input.friendid),
        unfollowuser: (_, input) => Friend.unfollowuser(input.userid, input.friendid)
    }
};

export default { typeDefs, resolvers };
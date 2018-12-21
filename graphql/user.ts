import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        user_id: String,
        username: String,
        dateentered: String
    }
`;

export default { typeDefs };
import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type Friend {
      id: String,
      name: String
    }
`;

export default { typeDefs };




export const typeDefs = /* GraphQL */ `
  type Trip {
    id: ID!
    title: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    health: String!
    trips: [Trip!]!
    trip(id: ID!): Trip

  }

  type Mutation {
    createTrip(title: String!): Trip!
  }
`;

export const typeDefs = /* GraphQL */ `
  type Trip {
    id: ID!
    title: String!
    content: String!
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
    updateTripContent(id: ID!, content: String!): Trip!
  }
`;

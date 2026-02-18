import { createSchema } from "graphql-yoga";
import { prisma } from "@travel/db";

export const schema = createSchema({
  typeDefs: /* GraphQL */ `
    type Trip {
      id: ID!
      title: String!
      createdAt: String!
      updatedAt: String!
    }

    type Query {
      health: String!
      trips: [Trip!]!
    }

    type Mutation {
      createTrip(title: String!, ownerId: String!): Trip!
    }
  `,
  resolvers: {
    Query: {
      health: () => "OK",
      trips: async () => {
        return prisma.trip.findMany();
      },
    },
    Mutation: {
      createTrip: async (_, { title, ownerId }) => {
        return prisma.trip.create({
          data: {
            title,
            ownerId,
          },
        });
      },
    },
  },
});

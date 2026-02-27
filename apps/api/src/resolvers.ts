import { prisma } from "@travel/db";

export const resolvers = {
  Query: {
    health: () => "OK",

    trips: async (_: any, __: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return prisma.trip.findMany({
        where: {
          ownerId: context.user.id,
        },
      });
    },

    trip: async (_: any, { id }: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const trip = await prisma.trip.findUnique({
        where: { id },
      });

      if (!trip) return null;

      if (trip.ownerId !== context.user.id) {
        throw new Error("Forbidden");
      }

      return trip;
    },
  },

  Mutation: {
    createTrip: async (_: any, { title }: any, context: any) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      return prisma.trip.create({
        data: {
          title,
          ownerId: context.user.id,
        },
      });
    },
    updateTripContent: async (
      _: any,
      { id, content }: any,
      context: any
    ) => {
      if (!context.user) {
        throw new Error("Not authenticated");
      }

      const trip = await prisma.trip.findUnique({
        where: { id },
      });

      if (!trip) {
        throw new Error("Trip not found");
      }

      if (trip.ownerId !== context.user.id) {
        throw new Error("Forbidden");
      }

      return prisma.trip.update({
        where: { id },
        data: {
          content,
        },
      });
    },
  },
};
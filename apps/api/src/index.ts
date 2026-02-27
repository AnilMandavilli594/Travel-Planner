import "dotenv/config";
import express, { type Request } from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { verifyToken } from "./auth";

const startServer = async () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.replace("Bearer ", "");

        if (!token) {
          return { user: null };
        }

        try {
          const decoded = await verifyToken(token);
          return { user: decoded };
        } catch (err) {
          console.error("JWT verification failed:", err);
          return { user: null };
        }
      },
    })
  );

  const PORT = Number(process.env.PORT ?? 4000);
  const HOST = process.env.HOST ?? "127.0.0.1";

  app.listen(PORT, HOST, () => {
    console.log(`🚀 GraphQL running at http://${HOST}:${PORT}/graphql`);
  });
};

startServer();

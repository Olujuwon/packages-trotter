import Fastify, { type FastifyInstance } from "fastify";
import { Liquid } from "liquidjs";
import * as dotenv from "dotenv";
import templateRenderer from "@fastify/view";
import packageRoutes from "./routes/packages";

dotenv.config();
// Init fastify
const fastify: FastifyInstance = Fastify({
    logger: true,
    trustProxy: true,
});
// Init template engine
const engine = new Liquid({
    root: "templates",
    extname: ".liquid",
    layouts: "templates",
    trimTagLeft: true,
    trimTagRight: true,
    trimOutputLeft: true,
    trimOutputRight: true,
    cache: true,
});

// check if environment is in GCP, this is used to determine the host
const IS_GOOGLE_CLOUD_RUN = process.env.K_SERVICE !== "false";
const host = IS_GOOGLE_CLOUD_RUN ? "0.0.0.0" : "localhost";

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
// register template engine to fastify using @fastify/view plugin
void fastify.register(templateRenderer, {
    engine: { liquid: engine },
    propertyName: "view",
});
// Default route
fastify.get("*", (req, reply) => {
    return reply.view("/templates/404.liquid", {});
});
// Route to Docs
fastify.get("/docs", (req, reply) => {
    return reply.view("/templates/docs.liquid", {});
});
// OS Packages related routes
void fastify.register(packageRoutes);

/**
 * Starts and listens to server
 * @returns Promise<>
 */
const start = async () => {
    try {
        await fastify.listen({ port, host });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
void start();

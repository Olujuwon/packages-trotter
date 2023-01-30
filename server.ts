import Fastify from "fastify";
import { Liquid } from "liquidjs";
import * as dotenv from "dotenv";
import templateRenderer from "@fastify/view";
import packageRoutes from "./routes/packages";

dotenv.config();

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

function build() {
  const fastify = Fastify({ trustProxy: true });
  return fastify;
}

async function start() {
  const IS_GOOGLE_CLOUD_RUN = process.env.K_SERVICE !== "false";

  const port = process.env.PORT ? Number(process.env.PORT) : 8080;

  const host = IS_GOOGLE_CLOUD_RUN ? "0.0.0.0" : "localhost";

  try {
    const fastify = build();

    void fastify.register(templateRenderer, {
      engine: { liquid: engine },
      propertyName: "view",
    });

    // Default route
    fastify.get("*", (req, reply) => {
      return reply.view("/templates/404.liquid", {});
    });

    // OS Packages related routes
    void fastify.register(packageRoutes);

    const address = await fastify.listen({ port, host });
    console.log(`Listening on ${address}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = build;

if (require.main === module) {
  void start();
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const liquidjs_1 = require("liquidjs");
const dotenv = __importStar(require("dotenv"));
const view_1 = __importDefault(require("@fastify/view"));
const packages_1 = __importDefault(require("./routes/packages"));
dotenv.config();
// Init fastify
const fastify = (0, fastify_1.default)({
    logger: true,
    trustProxy: true,
});
// Init template engine
const engine = new liquidjs_1.Liquid({
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
void fastify.register(view_1.default, {
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
void fastify.register(packages_1.default);
/**
 * Starts and listens to server
 * @returns Promise<>
 */
const start = async () => {
    try {
        await fastify.listen({ port, host });
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
void start();
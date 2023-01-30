"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const packages_1 = require("../controllers/packages");
// Options/schema definition for the getting all OS packages
const getPackagesOpts = {
    schema: {
        response: {
            200: {
                type: "object",
            },
        },
    },
    handler: packages_1.getPackages,
};
// Options/schema definition for the getting a single OS package by name
const getPackageOpts = {
    schema: {
        response: {
            200: {
                type: "object",
            },
        },
    },
    handler: packages_1.getPackage,
};
function packageRoutes(fastify, options, done) {
    // Get all OS Packages
    fastify.get("/", getPackagesOpts);
    // Get single OS Package by name
    fastify.get("/:name", getPackageOpts);
    done();
}
exports.default = packageRoutes;

import {getPackages, getPackage} from "../controllers/packages";
import {type FastifyInstance, type FastifyListenOptions} from "fastify";

// Options/schema definition for the getting all OS packages
const getPackagesOpts = {
    schema: {
        response: {
            200: {
                type: "object",
            },
        },
    },
    handler: getPackages,
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
    handler: getPackage,
};

function packageRoutes(
    fastify: FastifyInstance,
    options: FastifyListenOptions,
    done: any
) {
    // Get all OS Packages
    fastify.get("/", getPackagesOpts);

    // Get single OS Package by name
    fastify.get("/:name", getPackageOpts);
    done();
}

export default packageRoutes;

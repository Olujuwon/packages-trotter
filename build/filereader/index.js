"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
/**
 * Checks OS type, reads and returns systems files from different paths based on OS type
 *
 * @returns Promise
 */
const readFileFromPath = async (path, encoding) => {
    try {
        await (0, promises_1.access)(path, promises_1.constants.R_OK | promises_1.constants.W_OK);
        // @ts-ignore
        return await (0, promises_1.readFile)(path, { encoding });
    }
    catch (error) {
        return { error };
    }
};
exports.default = readFileFromPath;

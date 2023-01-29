"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("node:fs/promises");
const node_os_1 = __importDefault(require("node:os"));
/**
 * Checks OS type, reads and returns systems files from different paths based on OS type
 *
 * @returns Promise
 */
const readFileFromPath = async () => {
    let path;
    const encoding = process.env.FILE_ENCODING;
    const operatingSystem = node_os_1.default.type();
    if (operatingSystem === "Linux")
        path = process.env.FILE_PATH;
    else
        path = process.env.FILE_PATH_ALT;
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

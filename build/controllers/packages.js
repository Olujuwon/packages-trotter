"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = exports.getPackages = void 0;
const parser_1 = __importDefault(require("../parser"));
const filereader_1 = __importDefault(require("../filereader"));
const utilities_1 = require("../utilities");
const node_os_1 = __importDefault(require("node:os"));
/**
 * Reads OS package file, parses data to JSON format
 *
 * @returns IParsedJsonObject[]
 */
const _readSystemFileAndParseToJson = async () => {
    let _path;
    let _encoding = process.env.FILE_ENCODING;
    const operatingSystem = node_os_1.default.type();
    if (operatingSystem === "Linux")
        _path = process.env.FILE_PATH;
    else
        _path = process.env.FILE_PATH_ALT;
    const fileContent = await (0, filereader_1.default)(_path, _encoding);
    if (typeof fileContent !== "string" && fileContent.error) {
        throw new Error("Error reading file");
    }
    const fileDataParser = new parser_1.default(fileContent.toString());
    return await fileDataParser.parseOsPackageFields();
};
/**
 * The handler method for index page, fetches OS packages, parses and display data in the UI
 *
 * @returns Object
 */
const getPackages = async (req, reply) => {
    const _version = process.env.VERSION;
    try {
        const packagesParsed = await _readSystemFileAndParseToJson();
        (0, utilities_1._sortPackagesAlphabetically)(packagesParsed);
        return reply.view("/templates/index.liquid", {
            version: _version,
            title: "OS Installed Packages",
            data: packagesParsed,
        });
    }
    catch (error) {
        return reply.view("/templates/error.liquid", {
            error,
            version: _version,
            title: "404",
        });
    }
};
exports.getPackages = getPackages;
/**
 * The handler method for package specific page, fetches OS packages,
 * parses and display data in the UI
 *
 * @returns Object
 */
const getPackage = async (req, reply) => {
    // @ts-ignore
    const { name } = req.params;
    const _version = process.env.VERSION;
    try {
        const packagesParsed = await _readSystemFileAndParseToJson();
        const osPackageData = packagesParsed.filter((osPackage, index) => osPackage.name === name)[0];
        return reply.view("/templates/package.liquid", {
            version: _version,
            title: osPackageData.name,
            data: osPackageData,
            dependencies: osPackageData.depends.trim().split(","),
            reverseDependencies: osPackageData.reverseDepends.trim().split(","),
        });
    }
    catch (error) {
        return reply.view("/templates/error.liquid", {
            error,
            version: _version,
            title: "404",
        });
    }
};
exports.getPackage = getPackage;

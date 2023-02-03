"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = exports.getPackages = void 0;
const filereader_1 = __importDefault(require("../filereader"));
const node_os_1 = __importDefault(require("node:os"));
const parser_1 = __importDefault(require("../parser"));
/**
 * Reads OS package file, parses data to JSON format
 *
 * @returns IParsedJsonObject[]
 */
const _readSystemFileAndParseToJson = async () => {
    let _path;
    let _encoding = process.env.FILE_ENCODING;
    const operatingSystem = node_os_1.default.type();
    console.log("OS Type", operatingSystem);
    if (operatingSystem === "Linux")
        _path = "/var/lib/dpkg/status";
    else
        _path = "sample.txt";
    const fileContent = await (0, filereader_1.default)(_path, _encoding);
    if (typeof fileContent !== "string" && fileContent.error) {
        throw new Error("Error reading file");
    }
    return await (0, parser_1.default)(fileContent.toString());
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
        console.log("Packages", packagesParsed[0]);
        return reply.view("/templates/index.liquid", {
            version: _version,
            title: "OS Installed Packages",
            data: packagesParsed,
        });
    }
    catch (error) {
        console.log("Packages Error", error);
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

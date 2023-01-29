"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackage = exports.getPackages = void 0;
const parser_1 = __importDefault(require("../parser"));
const filereader_1 = __importDefault(require("../filereader"));
/**
 * Sorts parsed OS Packages alphabetically
 * @param osPackages <Array>
 * @returns IParsedJsonObject[]
 */
const _sortPackagesAlhabetically = (osPackages) => {
    return osPackages.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB)
            return -1;
        else if (nameA > nameB)
            return 1;
        else
            return 0;
    });
};
/**
 * Reads OS package file, parses data to JSON format
 *
 * @returns IParsedJsonObject[]
 */
const _readSystemFileAndParseToJson = async () => {
    const fileContent = await (0, filereader_1.default)();
    const fileDataParser = new parser_1.default(fileContent.toString());
    return await fileDataParser.parseOsPackageFields();
};
/**
 * The handler method for index page, fetches OS packages, parses and display data in the UI
 *
 * @returns Object
 */
const getPackages = async (req, reply) => {
    try {
        const packagesParsed = await _readSystemFileAndParseToJson();
        _sortPackagesAlhabetically(packagesParsed);
        return reply.view("/templates/index.liquid", {
            version: process.env.VERSION,
            title: "OS Installed Packages",
            data: packagesParsed,
        });
    }
    catch (error) {
        await reply.send({ error });
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
    try {
        const packagesParsed = await _readSystemFileAndParseToJson();
        const osPackageData = packagesParsed.filter((osPackage, index) => osPackage.name === name)[0];
        return reply.view("/templates/package.liquid", {
            version: process.env.VERSION,
            title: osPackageData.name,
            data: osPackageData,
            dependencies: osPackageData.depends.trim().split(","),
            reverseDependencies: osPackageData.reverseDepends.trim().split(","),
        });
    }
    catch (error) {
        void reply.send({ error });
    }
};
exports.getPackage = getPackage;

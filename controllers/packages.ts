import Parser, {type IParsedJsonObject} from "../parser";
import readFileFromPath from "../filereader";
import {type FastifyReply, type FastifyRequest} from "fastify";
import os from "node:os";
import parseOsPackageFields from "../parser";

/**
 * Reads OS package file, parses data to JSON format
 *
 * @returns IParsedJsonObject[]
 */
const _readSystemFileAndParseToJson = async (): Promise<
    IParsedJsonObject[]
> => {
    let _path;
    let _encoding = process.env.FILE_ENCODING as string;
    const operatingSystem = os.type();
    console.log("OS Type", operatingSystem);
    if (operatingSystem === "Linux") _path = "/var/lib/dpkg/status";
    else _path = "sample.txt";
    const fileContent = await readFileFromPath(_path, _encoding);
    if (typeof fileContent !== "string" && fileContent.error) {
        throw new Error("Error reading file");
    }
    return await parseOsPackageFields(fileContent.toString());
};
/**
 * The handler method for index page, fetches OS packages, parses and display data in the UI
 *
 * @returns Object
 */
export const getPackages = async (req: FastifyRequest, reply: FastifyReply) => {
    const _version = process.env.VERSION
    try {
        const packagesParsed = await _readSystemFileAndParseToJson();
        return reply.view("/templates/index.liquid", {
            version: _version,
            title: "OS Installed Packages",
            data: packagesParsed,
        });
    } catch (error) {
        return reply.view("/templates/error.liquid", {
            error,
            version: _version,
            title: "404",
        });
    }
};
/**
 * The handler method for package specific page, fetches OS packages,
 * parses and display data in the UI
 *
 * @returns Object
 */
export const getPackage = async (req: FastifyRequest, reply: FastifyReply) => {
    // @ts-ignore
    const {name} = req.params;
    const _version = process.env.VERSION
    try {
        const packagesParsed = await _readSystemFileAndParseToJson();
        const osPackageData = packagesParsed.filter(
            (osPackage, index) => osPackage.name === name
        )[0];
        return reply.view("/templates/package.liquid", {
            version: _version,
            title: osPackageData.name,
            data: osPackageData,
            dependencies: osPackageData.depends.trim().split(","),
            reverseDependencies: osPackageData.reverseDepends.trim().split(","),
        });
    } catch (error) {
        return reply.view("/templates/error.liquid", {
            error,
            version: _version,
            title: "404",
        });
    }
};

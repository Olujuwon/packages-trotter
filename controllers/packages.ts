import Parser, { type IParsedJsonObject } from "../parser";
import readFileFromPath from "../filereader";
import { type FastifyReply, type FastifyRequest } from "fastify";

/**
 * Sorts parsed OS Packages alphabetically
 * @param osPackages <Array>
 * @returns IParsedJsonObject[]
 */
const _sortPackagesAlhabetically = (osPackages: IParsedJsonObject[]): IParsedJsonObject[] => {
    return osPackages.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
    });
};
/**
 * Reads OS package file, parses data to JSON format
 *
 * @returns IParsedJsonObject[]
 */
const _readSystemFileAndParseToJson = async (): Promise<IParsedJsonObject[]> => {
    const fileContent = await readFileFromPath();
    const fileDataParser = new Parser(fileContent.toString());
    return await fileDataParser.parseOsPackageFields();
};
/**
 * The handler method for index page, fetches OS packages, parses and display data in the UI
 *
 * @returns Object
 */
export const getPackages = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const packagesParsed = await _readSystemFileAndParseToJson();
        _sortPackagesAlhabetically(packagesParsed);
        return reply.view("/templates/index.liquid", {
            version: process.env.VERSION,
            title: "OS Installed Packages",
            data: packagesParsed,
        });
    } catch (error) {
        await reply.send({ error });
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
    const { name } = req.params;
    try {
        const packagesParsed = await _readSystemFileAndParseToJson();
        const osPackageData = packagesParsed.filter(
            (osPackage, index) => osPackage.name === name
        )[0];
        return reply.view("/templates/package.liquid", {
            version: process.env.VERSION,
            title: osPackageData.name,
            data: osPackageData,
            dependencies: osPackageData.depends.trim().split(","),
            reverseDependencies: osPackageData.reverseDepends.trim().split(","),
        });
    } catch (error) {
        void reply.send({ error });
    }
};

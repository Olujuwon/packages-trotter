import {access, constants, readFile} from "node:fs/promises";


/**
 * Checks OS type, reads and returns systems files from different paths based on OS type
 *
 * @returns Promise
 */
const readFileFromPath = async (path: string, encoding: string): Promise<string | { error: object }> => {
    try {
        await access(path, constants.R_OK | constants.W_OK);
        // @ts-ignore
        return await readFile(path, {encoding});
    } catch (error: any) {
        return {error};
    }
};

export default readFileFromPath;

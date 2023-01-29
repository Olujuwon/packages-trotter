import { access, constants, readFile } from "node:fs/promises";
import os from "node:os";

/**
 * Checks OS type, reads and returns systems files from different paths based on OS type
 *
 * @returns Promise
 */
const readFileFromPath = async (): Promise<string | { error: object }> => {
    let path: string;
    const encoding = process.env.FILE_ENCODING;
    const operatingSystem = os.type();
    if (operatingSystem === "Linux") path = process.env.FILE_PATH as string;
    else path = process.env.FILE_PATH_ALT as string;
    try {
        await access(path, constants.R_OK | constants.W_OK);
        // @ts-ignore
        return await readFile(path, { encoding });
    } catch (error: any) {
        return { error };
    }
};

export default readFileFromPath;

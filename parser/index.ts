export interface IParsedJsonObject {
    name: string;
    description: string;
    depends: string;
    reverseDepends: string;
}

/**
 * Sorts parsed OS Packages alphabetically
 * @param {osPackages}
 * @returns IParsedJsonObject[]
 */
export const sortPackagesAlphabetically = (
    osPackages: IParsedJsonObject[]
): IParsedJsonObject[] => {
    return osPackages.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
    });
};

/**
 * Removes version number, bracket and other special characters from extracted dependency string
 * @param {str}
 * @returns string
 */
const sanitizeDependenciesString = (str: string): string => {
    const regex = /\s*\(.*?\)\s*/g;
    return str.replace(regex, " ");
}

/**
 * Extracts specified text from a given string using regex provided as param
 * @param {regExp}
 * @param {flag}
 * @param {textToSearch}
 * @returns string
 */
const searchAndExtractText = (regExp: string, flag: string, textToSearch: string): string => {
    const initRegExp = new RegExp(regExp, flag);
    let executeRegExp: any = [];
    executeRegExp = initRegExp.exec(textToSearch);
    if (executeRegExp === null) return "";
    return executeRegExp[1];
}

/**
 * Searches parsed packages JSON checking, if a package A's name is found in another package B's
 * depends field, package B is added to package A's reverseDepends field
 *
 * @returns Promise<void>
 */
const parsePackageReverseDependencies = async (osPackagesParsedToJson: IParsedJsonObject[]):
    Promise<IParsedJsonObject[]> => {
    for (let i = 0; i < osPackagesParsedToJson.length; i++
    ) {
        const currentPackage = osPackagesParsedToJson[i];
        const currentPackageReverseDependencies: string[] = [];
        osPackagesParsedToJson.forEach((osPackage, index) => {
            const {name, depends} = osPackage;
            if (depends === "") return;
            if (depends.includes(currentPackage.name))
                currentPackageReverseDependencies.push(name);
        });
        currentPackage.reverseDepends =
            currentPackageReverseDependencies.join(" , ");
    }
    return osPackagesParsedToJson;
}

/**
 * Splits fileData into array of strings, search and extract texts corresponding to specified
 * fields (i.e Package, Description and Depends) of the source file
 *
 * @returns Promise<void>
 */
const parseOsPackageFields = async (fileData: string): Promise<IParsedJsonObject[]> => {
    let osPackagesParsedToJson: IParsedJsonObject[] = [];
    const osPackagestringToArray = fileData.split("\n\n");
    osPackagestringToArray.forEach((osPackage, index) => {
        const osPackageString = osPackage.toString();
        const packageName = searchAndExtractText(
            "^Package:\\s(.*)",
            "g",
            osPackageString
        );
        const packageDescription = searchAndExtractText(
            "^Description:\\s(.+\\n(\\s.+\\n)*)",
            "m",
            osPackageString
        );
        const dependencies = sanitizeDependenciesString(
            searchAndExtractText("^Depends:\\s(.*\\s+)", "m", osPackageString)
        );
        osPackagesParsedToJson.push({
            name: packageName,
            description: packageDescription,
            depends: dependencies,
            reverseDepends: "",
        });
    });
    const osPackagesWithReverseDependencies = await parsePackageReverseDependencies(osPackagesParsedToJson);
    return sortPackagesAlphabetically(osPackagesWithReverseDependencies);
}

export default parseOsPackageFields;

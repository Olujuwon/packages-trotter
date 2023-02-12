"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortPackagesAlphabetically = void 0;
/**
 * Sorts parsed OS Packages alphabetically
 * @param {osPackages}
 * @returns IParsedJsonObject[]
 */
const sortPackagesAlphabetically = (osPackages) => {
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
exports.sortPackagesAlphabetically = sortPackagesAlphabetically;
/**
 * Removes version number, bracket and other special characters from extracted dependency string
 * @param {str}
 * @returns string
 */
const sanitizeDependenciesString = (str) => {
    const regex = /\s*\(.*?\)\s*/g;
    return str.replace(regex, " ");
};
/**
 * Extracts specified text from a given string using regex provided as param
 * @param {regExp}
 * @param {flag}
 * @param {textToSearch}
 * @returns string
 */
const searchAndExtractText = (regExp, flag, textToSearch) => {
    const initRegExp = new RegExp(regExp, flag);
    let executeRegExp = [];
    executeRegExp = initRegExp.exec(textToSearch);
    if (executeRegExp === null)
        return "";
    return executeRegExp[1];
};
/**
 * Searches parsed packages JSON checking, if a package A's name is found in another package B's
 * depends field, package B is added to package A's reverseDepends field
 *
 * @returns Array<string>
 */
const findReverseDependencies = (currentPackage, osPackagesParsedToJson, visited) => {
    const currentPackageReverseDependencies = [];
    if (visited.has(currentPackage.name)) {
        return [];
    }
    visited.add(currentPackage.name);
    osPackagesParsedToJson.forEach((osPackage) => {
        const { name, depends } = osPackage;
        if (depends === "")
            return;
        if (depends.includes(currentPackage.name)) {
            currentPackageReverseDependencies.push(name);
            currentPackageReverseDependencies.push(...findReverseDependencies(osPackage, osPackagesParsedToJson, visited));
        }
    });
    return currentPackageReverseDependencies;
};
/**
 * Loops through json format of OS packages and finds the reverse dependencies of each OS package
 *
 * @returns Array<IParsedJsonObject>
 */
const parseOsPackagesReverseDeps = (osPackagesParsedToJson) => {
    const visited = new Set();
    return osPackagesParsedToJson.map((osPackage) => {
        osPackage.reverseDepends = findReverseDependencies(osPackage, osPackagesParsedToJson, visited).join(", ");
        return osPackage;
    });
};
/**
 * Splits fileData into array of strings, search and extract texts corresponding to specified
 * fields (i.e Package, Description and Depends) of the source file
 *
 * @returns Promise<void>
 */
const parseOsPackageFields = (fileData) => {
    let osPackagesParsedToJson = [];
    const osPackagestringToArray = fileData.split("\n\n");
    osPackagestringToArray.forEach((osPackage, index) => {
        const osPackageString = osPackage.toString();
        const packageName = searchAndExtractText("^Package:\\s(.*)", "g", osPackageString);
        const packageDescription = searchAndExtractText("^Description:\\s(.+\\n(\\s.+\\n)*)", "m", osPackageString);
        const dependencies = sanitizeDependenciesString(searchAndExtractText("^Depends:\\s(.*\\s+)", "m", osPackageString));
        osPackagesParsedToJson.push({
            name: packageName,
            description: packageDescription,
            depends: dependencies,
            reverseDepends: ""
        });
    });
    const osPackagesWithReverseDependencies = parseOsPackagesReverseDeps(osPackagesParsedToJson);
    return (0, exports.sortPackagesAlphabetically)(osPackagesWithReverseDependencies);
};
exports.default = parseOsPackageFields;

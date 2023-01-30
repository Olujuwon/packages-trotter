"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Parses data from OS packages status file
 */
class Parser {
    osPackagesParsedToJson;
    fileData;
    /**
     * Creates instance of a parser with file data.
     * @param {fileData}
     */
    constructor(fileData) {
        this.fileData = fileData;
        this.osPackagesParsedToJson = [];
    }
    /**
     * Removes version number, bracket and other special characters from extracted dependency string
     * @param {str}
     * @returns string
     */
    sanitizeDependenciesString(str) {
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
    searchAndExtractText(regExp, flag, textToSearch) {
        const initRegExp = new RegExp(regExp, flag);
        let executeRegExp = [];
        executeRegExp = initRegExp.exec(textToSearch);
        if (executeRegExp === null)
            return "";
        return executeRegExp[1];
    }
    /**
     * Searches parsed packages JSON checking, if a package A's name is found in another package B's
     * depends field, package B is added to package A's reverseDepends field
     *
     * @returns Promise<void>
     */
    async parsePackageReverseDependencies() {
        for (let i = 0; i < this.osPackagesParsedToJson.length; i++) {
            const currentPackage = this.osPackagesParsedToJson[i];
            const currentPackageReverseDependencies = [];
            this.osPackagesParsedToJson.forEach((osPackage, index) => {
                const { name, depends } = osPackage;
                if (depends === "")
                    return;
                if (depends.includes(currentPackage.name))
                    currentPackageReverseDependencies.push(name);
            });
            currentPackage.reverseDepends =
                currentPackageReverseDependencies.join(" , ");
        }
    }
    /**
     * Splits fileData into array of strings, search and extract texts corresponding to specified
     * fields (i.e Package, Description and Depends) of the source file
     *
     * @returns Promise<void>
     */
    async parseOsPackageFields() {
        const osPackagestringToArray = this.fileData.split("\n\n");
        osPackagestringToArray.forEach((osPackage, index) => {
            const osPackageString = osPackage.toString();
            const packageName = this.searchAndExtractText("^Package:\\s(.*)", "g", osPackageString);
            const packageDescription = this.searchAndExtractText("^Description:\\s(.+\\n(\\s.+\\n)*)", "m", osPackageString);
            const dependencies = this.sanitizeDependenciesString(this.searchAndExtractText("^Depends:\\s(.*\\s+)", "m", osPackageString));
            this.osPackagesParsedToJson.push({
                name: packageName,
                description: packageDescription,
                depends: dependencies,
                reverseDepends: "",
            });
        });
        await this.parsePackageReverseDependencies();
        return this.osPackagesParsedToJson;
    }
}
exports.default = Parser;

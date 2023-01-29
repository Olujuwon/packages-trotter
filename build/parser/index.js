"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Parser {
    parsedJson;
    fileData;
    constructor(fileData) {
        this.fileData = fileData;
        this.parsedJson = [];
    }
    sanitizeDependenciesString(str) {
        const regex = /\s*\(.*?\)\s*/g;
        return str.replace(regex, " ");
    }
    searchAndSeperateText(regExp, flag, textToSearch) {
        const initRegExp = new RegExp(regExp, flag);
        let executeRegExp = [];
        executeRegExp = initRegExp.exec(textToSearch);
        if (executeRegExp === null)
            return "";
        return executeRegExp[1];
    }
    parsePackageName(osPackage) {
        return this.searchAndSeperateText("^Package:\\s(.*)", "g", osPackage);
    }
    parsePackageDescription(osPackage) {
        return this.searchAndSeperateText("^Description:\\s(.+\\n(\\s.+\\n)*)", "m", osPackage);
    }
    parsePackageDependencies(osPackage) {
        return this.sanitizeDependenciesString(this.searchAndSeperateText("^Depends:\\s(.*\\s+)", "m", osPackage));
    }
    // Todo break down to seperate/extract searching method
    async parsePackageReverseDependencies() {
        for (let i = 0; i < this.parsedJson.length; i++) {
            const currentPackage = this.parsedJson[i];
            const packageReverseDependencies = [];
            this.parsedJson.map((osPackage, index) => {
                const { name, depends } = osPackage;
                if (depends === "")
                    return;
                if (depends.includes(currentPackage.name))
                    packageReverseDependencies.push(name);
            });
            currentPackage.reverseDepends = packageReverseDependencies.join(" , ");
        }
    }
    async parseOsPackageFields() {
        const osPackagestringToArray = this.fileData.split("\n\n");
        osPackagestringToArray.forEach((osPackage, index) => {
            const osPackageString = osPackage.toString();
            const packageName = this.parsePackageName(osPackageString);
            const packageDescription = this.parsePackageDescription(osPackageString);
            const dependencies = this.parsePackageDependencies(osPackageString);
            this.parsedJson.push({
                name: packageName,
                description: packageDescription,
                depends: dependencies,
                reverseDepends: "",
            });
        });
        await this.parsePackageReverseDependencies();
        return this.parsedJson;
    }
}
exports.default = Parser;

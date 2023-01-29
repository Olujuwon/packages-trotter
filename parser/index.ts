export interface IParsedJsonObject {
    name: string;
    description: string;
    depends: string;
    reverseDepends: string;
}

class Parser {
    parsedJson: IParsedJsonObject[];
    fileData: string;
    constructor(fileData: string) {
        this.fileData = fileData;
        this.parsedJson = [];
    }

    private sanitizeDependenciesString(str: string): string {
        const regex = /\s*\(.*?\)\s*/g;
        return str.replace(regex, " ");
    }

    private searchAndSeperateText(regExp: string, flag: string, textToSearch: string): string {
        const initRegExp = new RegExp(regExp, flag);
        let executeRegExp: any = [];
        executeRegExp = initRegExp.exec(textToSearch);
        if (executeRegExp === null) return "";
        return executeRegExp[1];
    }

    private parsePackageName(osPackage: string): string {
        return this.searchAndSeperateText("^Package:\\s(.*)", "g", osPackage);
    }

    private parsePackageDescription(osPackage: string): string {
        return this.searchAndSeperateText("^Description:\\s(.+\\n(\\s.+\\n)*)", "m", osPackage);
    }

    private parsePackageDependencies(osPackage: string): string {
        return this.sanitizeDependenciesString(
            this.searchAndSeperateText("^Depends:\\s(.*\\s+)", "m", osPackage)
        );
    }

    // Todo break down to seperate/extract searching method
    private async parsePackageReverseDependencies(): Promise<void> {
        for (let i = 0; i < this.parsedJson.length; i++) {
            const currentPackage = this.parsedJson[i];
            const packageReverseDependencies: string[] = [];
            this.parsedJson.map((osPackage, index) => {
                const { name, depends } = osPackage;
                if (depends === "") return;
                if (depends.includes(currentPackage.name)) packageReverseDependencies.push(name);
            });
            currentPackage.reverseDepends = packageReverseDependencies.join(" , ");
        }
    }

    async parseOsPackageFields(): Promise<IParsedJsonObject[]> {
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

export default Parser;

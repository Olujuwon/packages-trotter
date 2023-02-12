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
};

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
};


/**
 * Searches parsed packages JSON checking, if a package A's name is found in another package B's
 * depends field, package B is added to package A's reverseDepends field
 *
 * @returns Array<string>
 */
const findReverseDependencies = (
  currentPackage: IParsedJsonObject,
  osPackagesParsedToJson: IParsedJsonObject[],
  visited: Set<string>
): string[] => {
  const currentPackageReverseDependencies: string[] = [];
  if (visited.has(currentPackage.name)) {
    return [];
  }
  visited.add(currentPackage.name);
  osPackagesParsedToJson.forEach((osPackage) => {
    const { name, depends } = osPackage;
    if (depends === "") return;
    if (depends.includes(currentPackage.name)) {
      currentPackageReverseDependencies.push(name);
      currentPackageReverseDependencies.push(
        ...findReverseDependencies(osPackage, osPackagesParsedToJson, visited)
      );
    }
  });
  return currentPackageReverseDependencies;
};

/**
 * Loops through json format of OS packages and finds the reverse dependencies of each OS package
 *
 * @returns Array<IParsedJsonObject>
 */
const parseOsPackagesReverseDeps = (osPackagesParsedToJson: IParsedJsonObject[]): IParsedJsonObject[] => {
  const visited = new Set<string>();
  return osPackagesParsedToJson.map((osPackage) => {
    osPackage.reverseDepends = findReverseDependencies(
      osPackage,
      osPackagesParsedToJson,
      visited
    ).join(", ");
    return osPackage;
  });
};

/**
 * Splits fileData into array of strings, search and extract texts corresponding to specified
 * fields (i.e Package, Description and Depends) of the source file
 *
 * @returns Promise<void>
 */
const parseOsPackageFields = (fileData: string): IParsedJsonObject[] => {
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
      reverseDepends: ""
    });
  });
  const osPackagesWithReverseDependencies = parseOsPackagesReverseDeps(osPackagesParsedToJson);
  return sortPackagesAlphabetically(osPackagesWithReverseDependencies);
};

export default parseOsPackageFields;

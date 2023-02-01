import {IParsedJsonObject} from "parser";

/**
 * Sorts parsed OS Packages alphabetically
 * @param {osPackages}
 * @returns IParsedJsonObject[]
 */
export const _sortPackagesAlphabetically = (
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


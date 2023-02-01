"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._sortPackagesAlphabetically = void 0;
/**
 * Sorts parsed OS Packages alphabetically
 * @param {osPackages}
 * @returns IParsedJsonObject[]
 */
const _sortPackagesAlphabetically = (osPackages) => {
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
exports._sortPackagesAlphabetically = _sortPackagesAlphabetically;

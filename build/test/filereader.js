"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = __importDefault(require("tap"));
const filereader_1 = __importDefault(require("../filereader/"));
const _fileReaderFromPath = async () => {
    const _path = "sample.txt";
    const _encoding = "utf8";
    return await (0, filereader_1.default)(_path, _encoding);
};
tap_1.default.test("Get file data already parsed to JSON format", async () => {
    const _fileReadFromPath = await _fileReaderFromPath();
    tap_1.default.type(_fileReadFromPath, "string");
});

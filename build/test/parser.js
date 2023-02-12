"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = __importDefault(require("tap"));
const filereader_1 = __importDefault(require("../filereader/"));
const parser_1 = __importDefault(require("../parser"));
const _fileReaderFromPath = async () => {
    const _path = "sample.txt";
    const _encoding = "utf8";
    return await (0, filereader_1.default)(_path, _encoding);
};
tap_1.default.test("Get file data already parsed to JSON format", async () => {
    const _fileReadFromPath = await _fileReaderFromPath();
    const fileDataToJSON = (0, parser_1.default)(_fileReadFromPath.toString());
    tap_1.default.type(_fileReadFromPath.toString(), "string");
    tap_1.default.type(fileDataToJSON[0], "object");
    tap_1.default.ok(fileDataToJSON[0]);
    tap_1.default.equal(fileDataToJSON[0].name, "accountsservice");
});

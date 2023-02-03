import tap from "tap";
import readFileFromPath from "../filereader/";
import parseOsPackageFields from "../parser";

const _fileReaderFromPath = async () => {
    const _path = "sample.txt";
    const _encoding = "utf8";
    return await readFileFromPath(_path, _encoding);
}

tap.test("Get file data already parsed to JSON format", async () => {
    const _fileReadFromPath = await _fileReaderFromPath();
    const fileDataToJSON = await parseOsPackageFields(_fileReadFromPath.toString());
    tap.type(_fileReadFromPath.toString(), "string");
    tap.type(fileDataToJSON[0], "object");
    tap.ok(fileDataToJSON[0]);
    tap.equal(fileDataToJSON[0].name, "accountsservice")
})


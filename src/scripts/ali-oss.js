/* eslint-disable import/no-dynamic-require */
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-check

const fs = require("fs");
const path = require("path").posix;
const { execSync } = require("child_process");

/**
 * @param {string} dirPath
 * @param {RegExp} [exclude]
 * @param {Date} [after]
 * @param {string[]} [arrayOfFiles=[]]
 * @returns {string[]}
 */
const getAllFiles = (dirPath, exclude, after, arrayOfFiles = []) => {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getAllFiles(filePath, exclude, after, arrayOfFiles);
        } else {
            if (exclude && filePath.match(exclude)) continue;
            const mtime = execSync(`git log -1 --pretty="format:%ci" "${filePath}"`, { encoding: "utf-8" });
            // console.log(filePath, new Date(mtime).getTime(), after?.getTime());
            if (after && new Date(mtime).getTime() <= after.getTime()) continue;
            arrayOfFiles.push(filePath);
        }
    }
    return arrayOfFiles;
};

// console.log(getAllFiles("./dist"));

const OSS = require("ali-oss");

const ossInfo = require("../../local/ali-oss.json");

const store = new OSS(ossInfo);

(async () => {
    const allFiles = [...getAllFiles("./dist"/* , /.js.map$/ */), ...getAllFiles("./examples"), ...getAllFiles("./help")];
    // console.log(allFiles);
    const list = await store.list({ prefix: "", "max-keys": 1000 }, {});
    // const onlineFiles = list.objects.map(o => o.name);
    // console.log(onlineFiles);
    const lastUpTime = new Date();
    lastUpTime.setTime(0);
    for (const file of list.objects) {
        if (allFiles.indexOf(file.name) === -1) {
            console.log("Del: \t" + file.name);
            await store.delete(file.name);
        } else {
            const t = new Date(file.lastModified).getTime();
            if (t > lastUpTime.getTime()) {
                lastUpTime.setTime(t);
            }
        }
    }
    console.log(lastUpTime);
    const upFiles = [...getAllFiles("./dist"/* , /.js.map$/ */, undefined, lastUpTime), ...getAllFiles("./examples", undefined, lastUpTime), ...getAllFiles("./help", undefined, lastUpTime)];
    for (const file of upFiles) {
        console.log("Put: \t" + file);
        const result = await store.put(file, file);
        console.log(result.res.status + "\t" + result.name);
    }
})();

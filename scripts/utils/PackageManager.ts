import {ManifestManager} from "./ManifestManager";
import {XMLParser} from "./XMLParser";

const walk = require('walk');

export class PackageManager {

    /**
     * @desc Parse package name by AndroidManifest.xml
     *
     * @param {function} callback - Call anonymous function when complete xml parse
     */
    public static getApplicationPackage(callback) {
        // TODO GET REAL PATH

        XMLParser.getInstance().xmlParser.parseString(ManifestManager.getManifestContent(), (err, result) => {
            callback(result.manifest.$.package);
        });
    }

    /**
     * @desc Parse package name list by walk module
     *
     * @param {string} packageName - Name of targeted package name
     * @param {function} callback - Call anonymous function when walker had end event
     */
    public static getPackages(packageName, callback) {
        let packageList = [];

        let options = {
            followLinks: false
        };

        packageList.push(packageName);

        let walker = walk.walk(`./app/src/main/java/${packageName.replace(/\./gi, '/')}`, options);

        walker.on("directories", (root, dirStatsArray, next) => {
            for (let dir of dirStatsArray) {
                packageList.push(root + "/" + dir.name.replace(/\//gi, "."));
            }
            next();
        });

        walker.on("end", () => {
            callback(packageList.map(value => {
                return value
                    .replace('./app/src/main/java/', '')
                    .replace(/\//gi, '.')
            }));

        });
    }
}
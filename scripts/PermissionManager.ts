import {MANIFAST_PATH} from "./constants/ManifestPath";
import * as xml2js from "xml2js";
import * as changeCase from "change-case";
import * as fs from "fs";


export class PermissionManager {

    private xmlParser: xml2js.Parser;
    private xmlBuilder: xml2js.Builder;

    constructor() {
        this.xmlBuilder = new xml2js.Builder();
        this.xmlParser = new xml2js.Parser();
    }

    /**
     * @desc Add permission to Manfest
     *
     * @param {string} permissionName - To add permission of name
     * @param callback
     */
    public addPermissionToManifest(permissionName: string, callback) {
        this.xmlParser.parseString(this.getManifestContent(), (err, result) => {
            if (!Array.isArray(result.manifest['uses-permission']))
                result.manifest['uses-permission'] = [];

            result.manifest['uses-permission'].push({
                '$': {
                    'android:name': `android.permission.${changeCase.upperCase(permissionName)}`
                }
            });
            callback(this.xmlBuilder.buildObject(result));
        })
    }

    private getManifestContent() {
        return fs.readFileSync(MANIFAST_PATH);
    }

}
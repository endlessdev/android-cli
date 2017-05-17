import {MANIFAST_PATH} from "./constants/ManifestPath";
import * as changeCase from "change-case";
import * as fs from "fs";

const xml2js = require('xml2js');

export class PermissionManager {

    private xmlParser;
    private xmlBuilder;

    constructor() {
        this.xmlBuilder = new xml2js.Builder();
        this.xmlParser = new xml2js.Parser();
    }

    /**
     * @desc Add permission to Manifest
     *
     * @param {string} permissionName - To add permission of name
     * @param callback
     */
    public addPermissionToManifest(permissionName: string, callback) {
        this.xmlParser.parseString(PermissionManager.getManifestContent(), (err, result) => {
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

    public static getManifestContent() {
        return fs.readFileSync(MANIFAST_PATH);
    }

    /**
     * @desc Parse package name by AndroidManifest.xml
     *
     * @param {function} callback - Call anonymous function when complete xml parse
     */
    public getApplicationPackage(callback) {
        // TODO GET REAL PATH

        this.xmlParser.parseString(PermissionManager.getManifestContent(), (err, result) => {
            callback(result.manifest.$.package);
        });
    }


}
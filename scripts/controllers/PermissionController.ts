import * as changeCase from "change-case";
import {ManifestManager} from "../utils/ManifestManager";
import {XMLParser} from "../utils/XMLParser";


export class PermissionController {

    /**
     * @desc Add permission to Manifest
     *
     * @param {string} permissionName - To add permission of name
     * @param callback
     */
    public addPermissionToManifest(permissionName: string, callback) {
        XMLParser.getInstance().xmlParser.parseString(ManifestManager.getManifestContent(), (err, result) => {
            if (!Array.isArray(result.manifest['uses-permission']))
                result.manifest['uses-permission'] = [];
            result.manifest['uses-permission'].push({
                '$': {
                    'android:name': `android.permission.${changeCase.upperCase(permissionName)}`
                }
            });
            callback(XMLParser.getInstance().xmlBuilder.buildObject(result));
        })
    }
}
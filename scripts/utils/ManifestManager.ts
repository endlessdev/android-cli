import {MANIFAST_PATH} from "../constants/ManifestPath";
import * as fs from "fs";

export class ManifestManager {
    public static getManifestContent() {
        return fs.readFileSync(MANIFAST_PATH);
    }
}
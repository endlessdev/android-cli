import {GRADLE_PATH} from "../constants/GradlePath";
import * as fs from "fs";
import * as shell from "shelljs";
import {Controller} from "./Controller";

const gradle = require('gradlejs');

export class DependencyController extends Controller {

    public addDependency(dependency: string, callback) {
        gradle.parseFile(GRADLE_PATH).then((representation) => {
            representation.dependencies.compile.push(`\'${dependency}\'`);
            console.log(gradle.makeGradleText(representation));
            fs.writeFile(GRADLE_PATH, gradle.makeGradleText(representation), err => {
                if (!err) {
                    let gradleSyncCommand: string = "";
                    const gradleOption: string = "clean build assemble";

                    if (DependencyController.isWindows())
                        gradleSyncCommand = `gradlew.bat ${gradleOption}`;
                    else
                        gradleSyncCommand = `./gradlew ${gradleOption}`;

                    shell.exec(gradleSyncCommand, (code, stdout, stderr) =>{
                        callback(code, stdout, stderr);
                    });
                }
            });
        });
    }

    private static isWindows() {
        return /^win/.test(process.platform);
    }
}
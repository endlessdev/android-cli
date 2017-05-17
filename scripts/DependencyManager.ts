import {GRADLE_PATH} from "./constants/GradlePath";
import * as fs from "fs";
import * as shell from "shelljs";

const gradle = require('gradlejs');

export class DependencyManager {

    public addDependency(dependency: string, callback) {
        gradle.parseFile(GRADLE_PATH).then((representation) => {
            representation.dependencies.compile.push(`\'${dependency}\'`);
            fs.writeFile(GRADLE_PATH, gradle.makeGradleText(representation), function (err) {
                if (!err) {

                    let gradleSyncCommand: string = "";

                    if (this.isWindows())
                        gradleSyncCommand = "gradlew.bat build";
                    else
                        gradleSyncCommand = "./gradlew build";

                    shell.exec(gradleSyncCommand, function (code, stdout, stderr) {
                        console.log('Exit code:', code);
                        console.log('Program output:', stdout);
                        console.log('Program stderr:', stderr);
                        callback();
                    })
                }
            });
        });
    }

    private isWindows() {
        return /^win/.test(process.platform);
    }
}
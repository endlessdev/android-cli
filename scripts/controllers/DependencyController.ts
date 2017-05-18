import {GRADLE_PATH} from "../constants/GradlePath";
import * as fs from "fs";
import * as shell from "shelljs";
import {Controller} from "./Controller";

// const gradle = require('gradlejs');

export class DependencyController extends Controller{

    public addDependency(dependency: string, callback) {
        //TODO FIX BUG GRADLE PARSE
        // gradle.parseFile(GRADLE_PATH).then((representation) => {
        //     representation.dependencies.compile.push(`\'${dependency}\'`);
        //     fs.writeFile(GRADLE_PATH, gradle.makeGradleText(representation), function (err) {
        //         if (!err) {
                    let gradleSyncCommand: string = "";
                    const gradleOption: string = "clean build assemble";

                    if (DependencyController.isWindows())
                        gradleSyncCommand = `gradlew.bat ${gradleOption}`;
                    else
                        gradleSyncCommand = `./gradlew ${gradleOption}`;

                    shell.exec(gradleSyncCommand, function (code, stdout, stderr) {
                        // console.log('Exit code:', code);
                        // console.log('Program output:', stdout);
                        // console.log('Program stderr:', stderr);
                        callback(code, stdout, stderr);
                    // });
                // }
            // });
        });
    }

    private static isWindows() {
        return /^win/.test(process.platform);
    }
}
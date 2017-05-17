import * as changeCase from "change-case";
import * as fs from "fs";
import {PermissionManager} from "./PermissionManager";

const chalk = require("chalk"),
    commander = require("commander"),
    xml2js = require('xml2js'),
    walk = require('walk');

export class GenerateManager {
    private xmlParser;
    private xmlBuilder;

    constructor() {
        this.xmlBuilder = new xml2js.Builder();
        this.xmlParser = new xml2js.Parser();
    }

    /**
     * @desc Generate rendered out file
     *
     * @param {string} componentType - Type of component
     * @param {string} componentName - Name of component
     * @param {string} targetPkg - Targeted package name
     */
    public generateRenderedOutFile(componentType: string, componentName: string, targetPkg: string) {

        let boilerplatesPath = `./boilerplates/${componentType}`;
        let boilerplateNameOfJAVA = `index.ac.src`;
        let boilerplateNameOfXML = `index.ac.layout`;

        let javaFileName: string = `${changeCase.pascalCase(componentName)}${changeCase.pascalCase(componentType)}.java`;
        let xmlFileName: string = `${changeCase.lowerCase(componentType)}_${changeCase.lowerCase(componentName)}.xml`;

        let javaContent: string = fs.readFileSync(`${boilerplatesPath}/${boilerplateNameOfJAVA}`, 'utf-8').toString();
        let xmlContent: string = fs.readFileSync(`${boilerplatesPath}/${boilerplateNameOfXML}`, 'utf-8').toString();

        let parsedJavaContent: string = this.renderAcFile(javaContent, targetPkg, componentName);
        let parsedXMLContent: string = this.renderAcFile(xmlContent, targetPkg, componentName);

        try {
            fs.writeFileSync(`./app/src/main/java/${targetPkg.replace(/\./gi, '/')}/${javaFileName}`, parsedJavaContent);
            console.log(chalk.green(`Successful generate ${componentType} ${javaFileName}`))
        } catch (err) {
            console.log(chalk.red(`Failed to generate ${componentType} ${javaFileName}`));
            console.log(chalk.red(err))
        }

        try {
            fs.writeFileSync(`./app/src/main/res/layout/${xmlFileName}`/*TODO GET REAL PATH*/, parsedXMLContent);
            console.log(chalk.green(`Successful generate layout file ${xmlFileName}`))
        } catch (err) {
            console.log(chalk.red(`Failed to generate layout file ${xmlFileName}`));
            console.log(chalk.red(err))
        }

    }

    /**
     * @desc Render boilerplate file by our specific format
     *
     * @param {string} fileContent - Content of boilerplate file
     * @param {string} pkgName - Targeted package name
     * @param {string} componentName - Name of componentName
     *
     * @return {string} - Content of rendered file
     */
    public renderAcFile(fileContent: string, pkgName: string, componentName: string) {
        return fileContent
            .replace(/{%packageName%}/gi, pkgName)
            .replace(/{%activityName%}/gi, changeCase.pascalCase(componentName))
            .replace(/{%activityNameLowerCase%}/gi, changeCase.lowerCase(componentName));
    }

    /**
     * @desc Parse package name list by walk module
     *
     * @param {string} packageName - Name of targeted package name
     * @param {function} callback - Call anonymous function when walker had end event
     */
    public getPackages(packageName, callback) {
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

    public getApplicationPackage(callback) {
        this.xmlParser.parseString(PermissionManager.getManifestContent(), (err, result) => {
            callback(result.manifest.$.package);
        });
    }

}
import * as changeCase from "change-case";
import * as fs from "fs";

const chalk = require("chalk"),
    commander = require("commander"),
    walk = require('walk');

export class GenerateController {


    /**
     * @desc Generate rendered out file
     *
     * @param {string} componentType - Type of component
     * @param {string} componentName - Name of component
     * @param {string} targetPkg - Targeted package name
     */
    public generateRenderedOutFile(componentType: string, componentName: string, targetPkg: string) {

        console.log(process.argv[1]);

        //TODO GET REAL BOILERPLATES PATH
        const boilerplatesPath = `../../boilerplates/${componentType}`,
            boilerplateNameOfJAVA = `index.ac.src`,
            boilerplateNameOfXML = `index.ac.layout`,

            javaFileName: string = `${changeCase.pascalCase(componentName)}${changeCase.pascalCase(componentType)}.java`,
            xmlFileName: string = `${changeCase.lowerCase(componentType)}_${changeCase.lowerCase(componentName)}.xml`,

            javaContent: string = fs.readFileSync(`${boilerplatesPath}/${boilerplateNameOfJAVA}`, 'utf-8').toString(),
            xmlContent: string = fs.readFileSync(`${boilerplatesPath}/${boilerplateNameOfXML}`, 'utf-8').toString(),

            parsedJavaContent: string = this.renderAcFile(javaContent, targetPkg, componentName),
            parsedXMLContent: string = this.renderAcFile(xmlContent, targetPkg, componentName);

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
}
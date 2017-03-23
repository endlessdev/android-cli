/**
 * @author Jade Yeom
 * @email ysw0094@gmail.com
 */

declare function require(name: string);

const commander = require('commander'),
    fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    walk = require('walk'),
    inquirer = require('inquirer'),
    xml2js = require('xml2js'),
    changeCase = require('change-case');

commander.arguments('<name>')
    .version('0.0.1')
    .option('-g, --generate [name]', 'component (e.g activity, fragment etc..)')
    .option('--adb-reset', 'kill server adb (required environment variable for ADB_PATH)')
    .action((name: string) => {

        let selectedPackage: string;
        let parsedJavaContent: string;
        let parsedXMLContent: string;

        presentInitialMessage();

        if (commander.generate) {

            console.log(chalk.yellow(`${changeCase.pascalCase(commander.generate)} will generated by Android CLI`));

            getApplicationPackage(pacakge => {
                getPackages(pacakge, packageList => {
                    let questions = [{
                        type: 'list',
                        name: 'package',
                        message: "Choose your target package path",
                        // TODO ADD JAVA PACKAGE PARSED PATH LIST
                        choices: packageList,
                    }];
                    inquirer.prompt(questions).then(answers => {
                        generateRenderedOutFile(commander.generate, name, answers.package);
                    });
                });
            });
        }
    }).parse(process.argv);



/**
 * @desc Parse package name by AndroidManifest.xml
 * 
 * @param {function} callback - Call anonymous function when complete xml parse
 */
function getApplicationPackage(callback) {
    // TODO GET REAL PATH
    let manifestContent: string = fs.readFileSync('./app/src/main/AndroidManifest.xml');
    let parser = new xml2js.Parser();

    parser.parseString(manifestContent, (err, result) => {
        callback(result.manifest.$.package);
    });
}

/**
 * @desc Parse package name list by walk module
 * 
 * @param {string} packageName - Name of targeted package name
 * @param {function} callback - Call anonymous function when walker had end event
 */
function getPackages(packageName, callback) {
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

/**
 * @desc Render boilerplate file by our specific format
 * 
 * @param {string} fileContent - Content of boilerplate file
 * @param {string} pkgName - Targeted package name
 * @param {string} componentName - Name of componentName
 * 
 * @return {string} - Content of rendered file
 */
function renderAcFile(fileContent: string, pkgName: string, componentName: string) {
    return fileContent
        .replace(/{%packageName%}/gi, pkgName)
        .replace(/{%activityName%}/gi, changeCase.pascalCase(componentName))
        .replace(/{%activityNameLowerCase%}/gi, changeCase.lowerCase(componentName));
}

/**
 * @desc Generate rendered out file
 * 
 * @param {string} componentType - Type of component
 * @param {string} componentName - Name of component
 * @param {string} targetPkg - Targeted package name
 */
function generateRenderedOutFile(componentType: string, componentName: string, targetPkg: string) {

    let boilerplatesPath = `./boilerplates/${componentType}`;
    let boilerplateNameOfJAVA = `${componentType}.ac.java`
    let boilerplateNameOfXML = `${componentType}_layout.ac.xml`

    let javaFileName: string = `${changeCase.pascalCase(componentName)}${changeCase.pascalCase(componentType)}.java`;
    let xmlFileName: string = `${changeCase.lowerCase(componentType)}_${changeCase.lowerCase(componentName)}.xml`;

    let javaContent: string = fs.readFileSync(`${boilerplatesPath}/${boilerplateNameOfJAVA}`, 'utf-8').toString();
    let xmlContent: string = fs.readFileSync(`${boilerplatesPath}/${boilerplateNameOfXML}`, 'utf-8').toString();

    let parsedJavaContent: string = renderAcFile(javaContent, targetPkg, componentName);
    let parsedXMLContent: string = renderAcFile(xmlContent, targetPkg, componentName);

    try {
        fs.writeFileSync(`./app/src/main/java/${targetPkg.replace(/\./gi, '/')}/${javaFileName}`, parsedJavaContent);
        console.log(chalk.green(`Successful generate ${componentType} ${javaFileName}`))
    } catch (err) {
        console.log(chalk.red(`Failed to generate ${componentType} ${javaFileName}`))
        console.log(chalk.red(err))
    }

    try {
        fs.writeFileSync(`${xmlFileName}`/*TODO GET REAL PATH*/, parsedXMLContent);
        console.log(chalk.green(`Successful generate layout file ${xmlFileName}`))
    } catch (err) {
        console.log(chalk.red(`Failed to generate layout file ${xmlFileName}`))
        console.log(chalk.red(err))
    }

}

/**
 * @desc Just present initial message
 */
function presentInitialMessage() {
    console.log(chalk.cyan("================================="));
    console.log(chalk.cyan("Welcome to Android CLI TOOL 0.0.1"));
    console.log(chalk.cyan("================================="));
}
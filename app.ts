/**
 * @author Jade Yeom
 * @email ysw0094@gmail.com
 */

declare function require(name: string);

let process : any;


const commander = require('commander'),
    fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    walk = require('walk'),
    inquirer = require('inquirer'),
    xml2js = require('xml2js'),
    changeCase = require('change-case'),
    gjs = require('gradlejs'),
    shell = require('shelljs');


let xmlParser = new xml2js.Parser();
let xmlBuilder = new xml2js.Builder();

commander.arguments('<name>')
    .version('0.0.1')
    .option('-g, --generate [name]', 'component (e.g activity, fragment etc..)')
    .option('-p, --permission <permission>', 'add uses-permission to manifest file(e.g INTERNET)')
    .option('-d, --dependency <dependency>', 'add dependency to build.gradle and sync gradle')
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

if (commander.permission) {
    console.log(commander.permission);
    addPermissionToManifest(commander.permission, xml => {
        try {
            fs.writeFileSync('./app/src/main/AndroidManifest.xml', xml);
            console.log(chalk.green(`Successful adding permission`));
        } catch (err) {
            console.log(chalk.red(`Failed to adding permission`));
            console.log(chalk.red(err))
        }
    });
}

if (commander.dependency) {
    console.log(commander.dependency);

    let gradlePath: string = "./app/build.gradle";

    gjs.parseFile(gradlePath).then((representation) => {
        representation.dependencies.compile.push(`\'${commander.dependency}\'`)
        fs.writeFile(gradlePath, gjs.makeGradleText(representation), function (err) {
            if (!err) {

                let gradleSyncCommand: string = "";

                if (isWindows())
                    gradleSyncCommand = "gradlew.bat build"
                else
                    gradleSyncCommand = "./gradlew build"


                shell.exec(gradleSyncCommand, function (code, stdout, stderr) {
                    console.log('Exit code:', code);
                    console.log('Program output:', stdout);
                    console.log('Program stderr:', stderr);
                })
            }
        });
    });

}

/**
 * @desc Add permission to Manfest
 * 
 * @param {string} permissionName - To add permission of name
 */
function addPermissionToManifest(permissionName: string, callback) {
    xmlParser.parseString(getManifestContent(), (err, result) => {

        if (!Array.isArray(result.manifest['uses-permission']))
            result.manifest['uses-permission'] = [];

        result.manifest['uses-permission'].push({
            '$': {
                'android:name': `android.permission.${changeCase.upperCase(permissionName)}`
            }
        })

        callback(xmlBuilder.buildObject(result));
    })
}

/**
 * @desc Parse package name by AndroidManifest.xml
 * 
 * @param {function} callback - Call anonymous function when complete xml parse
 */
function getApplicationPackage(callback) {
    // TODO GET REAL PATH

    xmlParser.parseString(getManifestContent(), (err, result) => {
        callback(result.manifest.$.package);
    });
}

function getManifestContent() {
    return fs.readFileSync('./app/src/main/AndroidManifest.xml');
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
    let boilerplateNameOfJAVA = `${componentType}.ac.src`
    let boilerplateNameOfXML = `${componentType}_layout.ac.layout`

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
        fs.writeFileSync(`./app/src/main/res/layout/${xmlFileName}`/*TODO GET REAL PATH*/, parsedXMLContent);
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

function isWindows() {
    return /^win/.test(process.platform);
}
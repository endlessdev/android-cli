/**
 * @author Jade Yeom
 * @email ysw0094@gmail.com
 */

declare function require(name: string);

let commander = require('commander'),
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
    .action(function (name: string) {
        console.log(chalk.cyan("================================="));
        console.log(chalk.cyan("Welcome to Android CLI TOOL 0.0.1"));
        console.log(chalk.cyan("================================="));
        if (commander.generate) {
            console.log(commander.generate, name);
            switch (commander.generate) {
                case "activity":
                    getApplicationPackage(function (pacakge) {
                        getPackages(pacakge, function (packageList) {
                            let questions = [{
                                type: 'list',
                                name: 'package',
                                message: "Choose your target package path",
                                // TODO ADD JAVA PACKAGE PARSED PATH LIST
                                choices: packageList,
                            }];
                            inquirer.prompt(questions).then(function (answers) {

                                let selectedPackage = answers.package;

                                let javaContent: string = fs.readFileSync('./boilerplates/activity/activity.ac.java', 'utf-8').toString()
                                let xmlContent: string = fs.readFileSync('./boilerplates/activity/activity_layout.ac.xml', 'utf-8').toString()

                                let parsedJavaContent = renderAcFile(javaContent, selectedPackage, name);
                                let parsedXMLContent = renderAcFile(xmlContent, selectedPackage, name);

                                try {
                                    fs.writeFileSync(`${changeCase.pascalCase(name)}Activity.java`, parsedJavaContent);
                                    console.log(chalk.green(`Successful generate activity ${changeCase.pascalCase(name)}Activity.java`))
                                } catch (err) {
                                    console.log(chalk.red(`Failed to generate activity ${changeCase.pascalCase(name)}Activity.java`))
                                    console.log(chalk.red(err))
                                }

                                try {
                                    fs.writeFileSync(`activity_${changeCase.lowerCase(name)}.xml`, parsedXMLContent);
                                    console.log(chalk.green(`Successful generate layout file activity_${changeCase.lowerCase(name)}.xml!`))
                                } catch (err) {
                                    console.log(chalk.red(`Failed to generate layout file activity_${changeCase.lowerCase(name)}.xml!`))
                                    console.log(chalk.red(err))
                                }

                            });
                        })
                    });
                    break;
            }
        }
    }).parse(process.argv);


function getApplicationPackage(callback) {
    // TODO GET REAL PATH
    let manifestContent: string = fs.readFileSync('./AndroidManifest.xml');
    let parser = new xml2js.Parser();

    parser.parseString(manifestContent, function (err, result) {
        callback(result.manifest.$.package);
    });
}

function getPackages(packageName, callback) {
    let packageList = [];

    let options = {
        followLinks: false
    };

    // TODO GET REAL PATH
    let walker = walk.walk("/tmp", options);

    walker.on("directories", function (root, dirStatsArray, next) {
        for (let dir of dirStatsArray) {
            packageList.push(dir.name)
        }
        next();
    });

    walker.on("end", function () {
        callback(packageList.map(function (value) { return `${packageName}.${value}` }));
    });
}

function renderAcFile(fileContent: string, pkgName: string, activityName: string) {
    return fileContent
        .replace(/{%packageName%}/gi, pkgName)
        .replace(/{%activityName%}/gi, changeCase.pascalCase(activityName))
        .replace(/{%activityNameLowerCase%}/gi, changeCase.lowerCase(activityName));
}
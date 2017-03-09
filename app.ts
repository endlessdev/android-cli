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
    xml2js = require('xml2js');

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
                                console.log(JSON.stringify(answers));
                                // let path: string = answers.pacakge;
                                // fs.readFile('./fileContents.js', 'utf-8', function (err, data) {
                                //     let parsedData: any[] = JSON.parse(data);
                                //     fs.writeFile(path, parsedData.['activity'].content, function (err) {
                                //         if (!err)
                                //             console.log(chalk.cyan.bgwhite.bold("Successful generated files :"));
                                //         else
                                //             console.log(chalk.red.bgblack.bold("ERR" + err));
                                //     })
                                // });
                            });
                        })
                    });




                    break;
            }
        }
    }).parse(process.argv);

function getApplicationPackage(callback) {
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
/**
 * @author Jade Yeom
 * @email ysw0094@gmail.com
 */

declare function require(name: string);

let commander = require('commander'),
    fs = require('fs'),
    chalk = require('chalk'),
    inquirer = require('inquirer');

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
                    let questions = [{
                        type: 'list',
                        name: 'package',
                        message: "Choose your target package path",
                        //TODO ADD JAVA PACKAGE PARSED PATH LIST
                        choices: ['foo', 'bar'],
                    }];

                    inquirer.prompt(questions).then(function (answers) {
                        console.log(JSON.stringify(answers));
                        let path: string = answers.pacakge;
                        fs.readFile('./fileContents.js', 'utf-8', function (err, data) {
                            let parsedData: any = JSON.parse(data);
                            fs.writeFile(path, parsedData[0].content, function (err) {
                                if (!err)
                                    console.log(chalk.cyan.bgwhite.bold("Successful generated files :"));
                                else
                                    console.log(chalk.read.bgblack.bold("ERR" + err));
                            })
                        });
                    });
                    break;
            }
        }
    }).parse(process.argv);

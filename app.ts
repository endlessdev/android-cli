import {GenerateManager} from "./scripts/GenerateManager";

const chalk = require('chalk'),
    figlet = require('figlet'),
    commander = require('commander');

const generateManager: GenerateManager = new GenerateManager();

commander.arguments('<name>')
    .version('0.0.1')
    .option('-g, --generate [name]', 'component (e.g activity, fragment etc..)')
    .option('-p, --permission <permission>', 'add uses-permission to manifest file(e.g INTERNET)')
    .option('-d, --dependency <dependency>', 'add dependency to build.gradle and sync gradle')
    .action((name: string) => {
        presentInitialMessage(() => {
            if (commander.generate) {
                generateManager.generateByScaffold();
            }
        });
    }).parse(process.argv);


/**
 * @desc Just present initial message
 */
function presentInitialMessage(callback) {
    figlet('Android CLI', (err, data) => {
        console.log(chalk.cyan(data));
        callback();
    })
}

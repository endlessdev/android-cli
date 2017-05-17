import * as commander from "commander";

commander.arguments('<name>')
    .version('0.0.1')
    .option('-g, --generate [name]', 'component (e.g activity, fragment etc..)')
    .option('-p, --permission <permission>', 'add uses-permission to manifest file(e.g INTERNET)')
    .option('-d, --dependency <dependency>', 'add dependency to build.gradle and sync gradle')
    .action((name: string) => {

    }).parse(process.argv);
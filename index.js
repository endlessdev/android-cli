let commander = require('commander');

commander
    .arguments('<name>')
    .option('-g, --generate <component>', 'component')
    .action(function(name){
        console.log(name, commander.component);
    }).parse(process.argv);
const watcher = require('watch');
const Reader = require('./Reader');
const Writer = require('./Writer');
const Logger = require('./Logger');
const Compiler = require('./Compiler');

const { 
  SOURCES_DIRECTORY,
  OUTPUT_DIRECTORY,
  OPTIMIZE
} = require('./constants');

const logger = new Logger();

async function exec() {
  watch();
}
exec();

async function read() {
  const reader = new Reader();
  return await reader.readFiles(SOURCES_DIRECTORY);
}

async function compile() {

  const sources = await read();
  // console.log(`SOURCES: `, sources);

  const options = {
    optimize: OPTIMIZE
  };

  const compiler = new Compiler();
  logger.log('COMPILING...');
  const output = await compiler.compile(sources, options);

  if(output.errors)
    logger.logErrors(output.errors);
  else 
    logger.log(`0 errors or warnings`);

  if(output.contracts) {
    const writer = new Writer();
    writer.writeFiles(OUTPUT_DIRECTORY, output.contracts);
    logger.log('DONE');
  }
}

function watch() {
  const watchOptions = {
    interval: 1 
  };
  watcher.watchTree(SOURCES_DIRECTORY, watchOptions, () => {
    logger.logInfo('<<< CHANGES DETECTED >>>');
    compile();
  });
}
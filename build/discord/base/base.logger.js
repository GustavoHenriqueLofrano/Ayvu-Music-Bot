import chalk from "chalk";
function log(...params) {
    return console.log(...params);
}
function success(...params) {
    return log(chalk.green(`✓`), ...params);
}
function warn(...params) {
    return console.warn(chalk.yellow(`▲`), ...params);
}
function error(...params) {
    return console.error(chalk.red(`✖︎`), ...params);
}
export const logger = {
    log,
    success,
    warn,
    error,
};

export default (...args: any[]) => ({
  black: () => console.log(`\x1b[30m${args.join(' ')}`),
  red: () => console.log(`\x1b[31m${args.join(' ')}`),
  green: () => console.log(`\x1b[32m${args.join(' ')}`),
  yellow: () => console.log(`\x1b[33m${args.join(' ')}`),
  blue: () => console.log(`\x1b[34m${args.join(' ')}`),
  magenta: () => console.log(`\x1b[35m${args.join(' ')}`),
  cyan: () => console.log(`\x1b[36m${args.join(' ')}`),
  white: () => console.log(`\x1b[37m${args.join(' ')}`),
  bgBlack: () => console.log(`\x1b[40m${args.join(' ')}\x1b[0m`),
  bgRed: () => console.log(`\x1b[41m${args.join(' ')}\x1b[0m`),
  bgGreen: () => console.log(`\x1b[42m${args.join(' ')}\x1b[0m`),
  bgYellow: () => console.log(`\x1b[43m${args.join(' ')}\x1b[0m`),
  bgBlue: () => console.log(`\x1b[44m${args.join(' ')}\x1b[0m`),
  bgMagenta: () => console.log(`\x1b[45m${args.join(' ')}\x1b[0m`),
  bgCyan: () => console.log(`\x1b[46m${args.join(' ')}\x1b[0m`),
  bgWhite: () => console.log(`\x1b[47m${args.join(' ')}\x1b[0m`)
});
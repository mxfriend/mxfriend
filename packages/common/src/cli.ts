export type LogFn = (message: string, verbose?: boolean) => void;

export const log: LogFn = (message) => {
  process.stderr.write(message);
};

export const logUnlessQuiet: LogFn = (value, verbose) => {
  verbose || log(value);
};

export function parseArgs(argv: string[], ...options: string[]): [string[], ...string[]] {
  const required = options.filter(o => o.startsWith('<'));
  const optional = options.filter(o => o.startsWith('['));
  const rest = optional.some(o => o.startsWith('[...'));
  options = options.filter(o => o.startsWith('-'));
  const args: string[] = [];
  const opts: string[] = [];

  for (const arg of argv.slice(2)) {
    if (arg.startsWith('-')) {
      if (options.includes(arg)) {
        opts.push(arg);
      } else {
        printUsage();
      }
    } else if (rest || args.length < required.length + optional.length) {
      args.push(arg);
    } else {
      printUsage();
    }
  }

  if (args.length < required.length) {
    printUsage();
  }

  return [opts, ...args];

  function printUsage(): [] {
    log(`Usage: ${argv[0]} ${argv[1]} [${options.join('|')}] ${required.join(' ')} ${optional.join(' ')}\n\n`);
    process.exit(1);
  }
}

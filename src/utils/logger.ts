import pino from 'pino';

const enablePrettyLogging: boolean =
  process.env.ENABLE_PRETTY_LOG === 'true' &&
  process.env.NODE_ENV !== 'production'; // exclude on prod for better logging performance

const destination =
  process.env.NODE_ENV === 'test'
    ? pino.destination('/dev/null')
    : pino.destination(1); // STDOUT

const opts = enablePrettyLogging ?
  {
    transport: {
      target: 'pino-pretty'
    },
  } : {};
    
const logger = pino(
  opts,
  destination
);

export { logger };

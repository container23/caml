/**
 * SLASH COMMANDS DEFINITIONS
 */

export const MIN_INPUT_LENGTH = 2;
export const MAX_INPUT_LENGTH = 80;

// Simple test "health check" command
export const TEST_COMMAND: Command = {
  name: 'test',
  description: 'Basic health check command',
  type: 1,
};

// Define requirements for Check command
export const SIMPLE_CHECK_COMMAND: Command = {
  name: 'check',
  description: 'Simple AML verification check',
  options: [
    {
      type: 3,
      name: 'value',
      description: 'Enter value to check',
      min_length: MIN_INPUT_LENGTH,
      max_length: MAX_INPUT_LENGTH,
      required: true
    },
  ],
  type: 1,
};

export const VERBOSE_CHECK_COMMAND: Command = {
  name: 'checkv',
  description: 'Verbose AML verification check, includes additional details of result',
  options: [
    {
      type: 3,
      name: 'value',
      description: 'Enter value to check',
      min_length: MIN_INPUT_LENGTH,
      max_length: MAX_INPUT_LENGTH,
      required: true
    },
  ],
  type: 1,
};

export const HEALTH_COMMAND: Command = {
  name: 'health',
  description: 'Health / Heatbeat check',
  type: 1,
};

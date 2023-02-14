/**
 * SLASH COMMANDS DEFINITIONS
 */

import { MAX_SEARCH_INPUT_LENGTH, MIN_SEARCH_INPUT_LENGTH } from '../search/types';

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
      min_length: MIN_SEARCH_INPUT_LENGTH,
      max_length: MAX_SEARCH_INPUT_LENGTH,
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
      min_length: MIN_SEARCH_INPUT_LENGTH,
      max_length: MAX_SEARCH_INPUT_LENGTH,
      required: true
    },
  ],
  type: 1,
};
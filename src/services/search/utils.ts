import fs from 'fs';
import readline from 'readline';

/**
 * Builds a boundary seach regexp for given input searchTxt
 * @param searchTxt 
 * @returns 
 */
export const buildSearchRegEx = (searchTxt: string) => {
  const searchFlags = 'gmi'; // global, multiline, insensitive
  const searchQuery = `\\b${searchTxt}\\b`; // search within boundary
  const regEx = new RegExp(searchQuery, searchFlags);
  return regEx;
};

const SANITIZED_STR_REGEXP = /[`<>()?%!^~$#^*]/gm;
/**
 * Clean up special characters from str
 * @param str 
 * @returns 
 */
export const sanitizeStr = (str = '') => {
  return str.replace(SANITIZED_STR_REGEXP, '');
};

/**
 * Validate date str has format DD/MM/YYYY 
 * @param dateStr 
 * @returns 
 */
export const isValidDateStr = (dateStr = '') =>
  /\d{1,2}\/\d{2}\/\d{4}/gm.test(dateStr);

export const buildReadlineStream = async (filepath: string) => {
  const inStream = fs.createReadStream(filepath);
  const rl = readline.createInterface(inStream);
  return rl;
};

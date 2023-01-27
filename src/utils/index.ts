// Simple method that returns a random emoji from list
const emojiList = [
  '😭',
  '😄',
  '😌',
  '🤓',
  '😎',
  '😤',
  '🤖',
  '😶‍🌫️',
  '🌏',
  '📸',
  '💿',
  '👋',
  '🌊',
  '✨',
];
export const getRandomEmoji = () => emojiList[Math.floor(Math.random() * emojiList.length)];

// configs
export const ENVIRONMENT = process.env.NODE_ENV || 'dev';
export const IS_PROD_ENV = ENVIRONMENT == 'production';
export const ENABLE_ANALYTICS = process.env.ENABLE_ANALYTICS || IS_PROD_ENV;
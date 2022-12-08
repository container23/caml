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
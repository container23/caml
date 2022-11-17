import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

const BASE_API_URL = 'https://discord.com/api/v10/';

export const verifyDiscordRequest = (clientKey) => {
  return function (req, res, buf) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export const discordRequest = async (endpoint, options) => {
  const url = BASE_API_URL + endpoint;
  if (options.body) options.body = JSON.stringify(options.body);
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'AMLKYCBot (https://github.com/ysfdev2/amlkyc-bot, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}
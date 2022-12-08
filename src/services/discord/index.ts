import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';
import { Request, Response } from '../../api/utils/index';

const BASE_API_URL = 'https://discord.com/api/v10/';

export const verifyDiscordRequest = (clientKey: string) => {
  return (req: Request, res: Response, buf: Buffer) => {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const discordRequest = async (
  endpoint: string,
  options: any = {}
) => {
  if (options.data) { options.data = JSON.stringify(options.data)}
  const url = BASE_API_URL + endpoint
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'AMLKYCBot (https://github.com/ysfdev2/amlkyc-bot, 1.0.0)',
    },
    ...options,
  });
  if (!res.ok) {
    throw new Error(JSON.stringify(await res.json()));
  }
  // return original response
  return res.json();
};
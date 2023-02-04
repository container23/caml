import { DISCORD_BOT_AUTH_URL, Handler } from '../utils';

export const handleAbout: Handler = async (_, res) => {
  const data = {
    discordBotAuth: DISCORD_BOT_AUTH_URL,
    gtmId: res.locals.gtmId,
  };
  res.render('about', data);
};
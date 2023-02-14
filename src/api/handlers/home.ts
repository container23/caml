import { MAX_SEARCH_INPUT_LENGTH, MIN_SEARCH_INPUT_LENGTH } from '../../services/search/types';
import { DISCORD_BOT_AUTH_URL, Handler } from '../utils';

export const handleHome: Handler = async (_, res) => {
  const data = {
    discordBotAuth: DISCORD_BOT_AUTH_URL,
    gtmId: res.locals.gtmId,
    minSearchLength: MIN_SEARCH_INPUT_LENGTH,
    maxSearchLength: MAX_SEARCH_INPUT_LENGTH
  };
  res.render('home', data);
};
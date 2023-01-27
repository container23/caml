import { NextFunction, Request, Response } from 'express';
import { ENABLE_ANALYTICS } from '../../utils';
import { Event, GTM_ID, sendEvents } from '../../utils/analytics';
import { logger } from '../../utils/logger';

/**
 * Track discord interaction request event
 * @param req
 */
export const trackDiscordInteractionReq = async (req: Request) => {
  try {
    // only track requests with valid data
    if (!req.body || !req.body || !req.body.guild_id || !req.body.member) {
      return;
    }

    const body = req.body;
    const userId = body.member.user.id;
    const params: Record<string, unknown> = {
      user_id: userId,
      guild_id: body.guild_id,
      channel_id: body.channel_id,
    };
    if (body.data) {
      params.cmd_name = body.data.name;
      params.search_term = body.data.options ? body.data.options[0].value : '';
    }
    const event: Event = {
      name: 'discord_bot_interaction',
      params: params,
    };
    await sendEvents([event], userId);
  } catch (error: any) {
    logger.error({
      msg: 'error sending discord analytics event',
      error: error.message,
    });
    logger.error(error);
  }
};

const trackReq = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.gtmId = GTM_ID;
  if (ENABLE_ANALYTICS) {
    await trackDiscordInteractionReq(req);
  }
  next();
};

export const trackAnalytics = () => trackReq;

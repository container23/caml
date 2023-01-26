import fetch from 'node-fetch';
import { logger } from './logger';

export const gtmId: string = process.env.GTM_ID || '';
const gtmClientId: string = process.env.GTM_CLIENT_ID || '';
const gtmApiSecret: string = process.env.GTM_API_SECRET || '';

const gtmBaseURL = 'https://www.google-analytics.com/mp/collect';
const gtmURL = `${gtmBaseURL}?measurement_id=${gtmId}&api_secret=${gtmApiSecret}`;

export type Event = {
  name: string;
  params?: Record<string, unknown>;
};

/**
 * Send custom anlytics event
 * @param events An array of event items.
 * @param userId Optional. A unique identifier for a user.
 */
export const sendEvent = async (events: Event[], userId?: string) => {
  logger.info('sending new anylytics event');
  if (!gtmId || !gtmApiSecret || !gtmClientId) {
    logger.warn({
      msg: 'missing required values to send analytics event',
      gtmId: !!gtmId,
      gtmApiSecret: !!gtmApiSecret,
      gtmClientId: !!gtmClientId,
    });
    return;
  }
    
  return fetch(gtmURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: gtmClientId,
      user_id: userId,
      events: events,
    }),
  });
};

/**
 * Track discord interaction request
 * @param req
 */
export const trackDiscordInteractionReq = async () => {
  try {
    // TODO: extract discord data
    // discord req
    // extract
    // Discord server ID
    // User ID
    // Searched texts
  } catch (error) {
    logger.error({ msg: 'error sending discord analytics reqs', error });
  }
};

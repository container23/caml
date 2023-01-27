import fetch from 'node-fetch';
import { logger } from './logger';

export const GTM_ID: string = process.env.GTM_ID || '';
const GTM_ClIENT_ID: string = process.env.GTM_CLIENT_ID || '';
const GTM_API_SECRET: string = process.env.GTM_API_SECRET || '';

const gtmBaseURL = 'https://www.google-analytics.com/mp/collect';
const gtmURL = `${gtmBaseURL}?measurement_id=${GTM_ID}&api_secret=${GTM_API_SECRET}`;

export type Event = {
  name: string;
  params?: Record<string, unknown>;
};

/**
 * Send custom anlytics event
 * @param events An array of event items.
 * @param userId Optional. A unique identifier for a user.
 */
export const sendEvents = async (events: Event[], userId?: string) => {
  logger.info(`sending new anylytics event: ${userId}`);
  if (!GTM_ID || !GTM_API_SECRET || !GTM_ClIENT_ID) {
    logger.warn({
      msg: 'missing required values to send analytics event',
      gtmId: !!GTM_ID,
      gtmApiSecret: !!GTM_API_SECRET,
      gtmClientId: !!GTM_ClIENT_ID,
    });
    throw new Error('missing required values to send analytics event');
  }

  return fetch(gtmURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: GTM_ClIENT_ID,
      user_id: userId,
      events: events,
    }),
    // todo add timeout controller
  });
};

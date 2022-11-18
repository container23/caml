import {json} from 'express';
import { verifyDiscordRequest } from '../../services/discord/index.js'

import bodyParser from 'body-parser';

export const setupMiddlewares = (app) => {
    // app.use(bodyParser.json());
    // discord
    app.use(json({ verify: verifyDiscordRequest(process.env.PUBLIC_KEY) }));
}
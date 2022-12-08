import 'dotenv/config';
import express, {Express} from 'express';
import { setupMiddlewares } from './middlewares/index';
import { setupRoutes } from './routing';

const server = express();

setupMiddlewares(server);
setupRoutes(server);

export type Server = Express
export default server

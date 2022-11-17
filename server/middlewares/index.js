import { discordRequestVerify } from "./discord.js"

export const setupMiddlewares = (app) => {
    app.use(discordRequestVerify);
}
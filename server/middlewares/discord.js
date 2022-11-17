import {json} from 'express'

export const discordRequestVerify = () => {
    // Parse request body and verifies incoming requests using discord-interactions package
    return json({ verify: verifyDiscordRequest(process.env.PUBLIC_KEY) })
}
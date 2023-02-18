# Discord Bot

Simple discord bot integrated with AML search.

## How to install the Bot on your Discord Server 

You can integrate and test this bot on your discord Guild server by following below instructions.

1) Open the Bot [authorization  link.](https://discord.com/api/oauth2/authorize?client_id=1041133202242285699&permissions=2147485696&scope=applications.commands%20bot)

2) Select the Server where you will like to enable the Bot. 

3) Select and Confirm the Bot permissions to *Send Messages* and *Use Application Commands*.

4) Click Authorize. If successful, you should receive an `Authorized` message.

5) Navigate to the Discord server where the bot was enabled. Type: `/check hello`, to see a sample verification result from **kycaml-bot**.

## Running app locally

Before you start, you'll need to [create a Discord app](https://discord.com/developers/applications) with the proper permissions as described below.
in OAuth2 section ensure autorization is set to:
 * In-app autorization 
 * both scopes are selected
    - `applications.commands`
    - `bot` 
* text-permission section
    - Send Messages
    - Use slash commands

Under Bot section 
 * use (reset) the token for the env file
 * ensure public bot & oath2 code grant are enabled

First clone the project:
```
git clone https://github.com/container23/caml.git
```

Then navigate to its directory and install dependencies:
```
cd caml
npm install
```

### Get app credentials

Fetch the credentials from your app's settings and add them to a `.env` file (see `env.sample` for an example). You'll need your app ID (`APP_ID`), server ID (`GUILD_ID`), bot token (`DISCORD_TOKEN`), and public key (`PUBLIC_KEY`).

Fetching credentials is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

> 🔑 Environment variables can be added to the `.env` file in Glitch or when developing locally, and in the Secrets tab in Replit (the lock icon on the left).


### Local testing APIs

For local development, you can send direct HTTP requests to verify API endpoints.

First start the server: `make start`

#### POST /interactions 

API to process interactions commands. 

**URL: POST *http://localhost:8080/interactions***

**Sample JSON Request Body**

Sample request for verbose AML check (`checkv`) command.

```json
{
    "type": 2,
    "token": "A_UNIQUE_TOKEN",
    "member": {
        "user": {
            "id": "53908232506183680",
            "username": "Mason",
            "avatar": "a_d5efa99b3eeaa7dd43acca82f5692432",
            "discriminator": "1337",
            "public_flags": 131141
        },
        "roles": ["539082325061836999"],
        "premium_since": null,
        "permissions": "2147483647",
        "pending": false,
        "nick": null,
        "mute": false,
        "joined_at": "2017-03-13T19:19:14.040000+00:00",
        "is_pending": false,
        "deaf": false
    },
    "id": "786008729715212338",
    "guild_id": "290926798626357999",
    "app_permissions": "442368",
    "guild_locale": "en-US",
    "locale": "en-US",
    "data": {
        "options": [{
            "type": 3,
            "name": "checkv",
            "value": "XBT 3Q5dGfLKkWqWSwYtbMUyc8xGjN5LrRviK4"
        }],
        "type": 1,
        "name": "checkv",
        "id": "771825006014889984"
    },
    "channel_id": "645027906669510667"
}
```

### Set up interactivity

The project needs a public endpoint where Discord can send requests. To develop and test locally, you can use something like [`ngrok`](https://ngrok.com/) to tunnel HTTP traffic.

Install ngrok if you haven't already, then start listening on port `8080`:

```
ngrok http 8080
```

You should see your connection open:

```
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://1234-someurl.ngrok.io -> localhost:8080

Connections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

To test the bot server is proxied throught ngrock, browse to `https://1234-someurl.ngrok.io` click `visit site` button, then you'll get an HTML page stating `Hello Bot :)`.

Copy the forwarding address that starts with `https`, in this case `https://1234-someurl.ngrok.io`, then go to your [app's settings](https://discord.com/developers/applications).

On the **General Information** tab, there will be an **Interactions Endpoint URL**. Paste your ngrok address there, and append `/interactions` to it (`https://1234-someurl.ngrok.io/interactions` in the example).

Click **Save Changes**, and your app should be ready to run 🚀

## Generate OAuth2 URL

In order to integrate the app into the server, you will need to grant permissions.

1) Navigate to your [discord applications](https://discord.com/developers/applications)
2) Select the Bot application to manage
3) On right menue, Click OAuth2, then URL Generator
4) Select Scopes: `bot` and `applications.commands`
5) Select Bot Permissions: `Send Messages` and `Use Slash Commands`
6) Copy the Generated URL. Will look something like: `https://discord.com/api/oauth2/authorize?client_id={{BOT APP ID}}&permissions=2147485696&scope=applications.commands%20bot`
7) Open the URL in a new browser tab
8) Follow the flow in the screen to Authorize the Bot into your desired Discord server
9) Then you should success page

## Verify Bot Commands

To verify app is working into any channel in the auhorized Discord server. You should be able to run any of below slash commands:

- `/test` Performs a simple hello message
- `/check` Runs a simple AML check verificaton from a given input string
- `/checkv` Runs same verification as `/check` but returns additional details

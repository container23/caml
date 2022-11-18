# Discord AML/KYC Bot

A simple Discord Bot, which allows performing verifications such as AML, KYC, etc.

## Project structure
Below is a basic overview of the project structure:

```
├── env.sample -> sample .env file
├── data-sources -> sources AML SDN list 
├── app.js      -> main entrypoint for app
├── server -> server handlers and middlewares
├── utils    -> utility functions and enums
├── services -> core services for business logic
├── package.json
├── README.md
└── .gitignore
```

## Running app locally

Before you start, you'll need to [create a Discord app](https://discord.com/developers/applications) with the proper permissions:
- `applications.commands`
- `bot` (with Send Messages enabled)

First clone the project:
```
git clone https://github.com/ysfdev/discord-bot-poc.git
```

Then navigate to its directory and install dependencies:
```
cd discord-bot-poc
npm install
```
### Get app credentials

Fetch the credentials from your app's settings and add them to a `.env` file (see `env.sample` for an example). You'll need your app ID (`APP_ID`), server ID (`GUILD_ID`), bot token (`DISCORD_TOKEN`), and public key (`PUBLIC_KEY`).

Fetching credentials is covered in detail in the [getting started guide](https://discord.com/developers/docs/getting-started).

> 🔑 Environment variables can be added to the `.env` file in Glitch or when developing locally, and in the Secrets tab in Replit (the lock icon on the left).

### Run the app

After your credentials are added, go ahead and run the app:

```
node app.js
```

### Run tests

```
npm test
```

> ⚙️ A package [like `nodemon`](https://github.com/remy/nodemon), which watches for local changes and restarts your app, may be helpful while locally developing.

### Set up interactivity

The project needs a public endpoint where Discord can send requests. To develop and test locally, you can use something like [`ngrok`](https://ngrok.com/) to tunnel HTTP traffic.

Install ngrok if you haven't already, then start listening on port `3000`:

```
ngrok http 3000
```

You should see your connection open:

```
Tunnel Status                 online
Version                       2.0/2.0
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://1234-someurl.ngrok.io -> localhost:3000
Forwarding                    https://1234-someurl.ngrok.io -> localhost:3000

Connections                  ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

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
6) Copy the Generated URL. Will look something like: `https://discord.com/api/oauth2/authorize?client_id=1041133202242285699&permissions=2147485696&scope=applications.commands%20bot`
7) Open the URL in a new browser tab
8) Follow the flow in the screen to Authorize the Bot into your desired Discord server
9) Then you should success page

## Verify Bot Commands

To verify app is working into any channel in the auhorized Discord server. You should be able to run any of below slash commands:

- `/test` Performs a simple hello message
- `/check` Runs a simple AML check verificaton from a given input string
- `/checkv` Runs same verification as `/check` but returns additional details
# TalkLikeAI Discord Bot

A Discord bot that converts text to speech using ElevenLabs AI voice synthesis. This bot allows users to generate AI voices directly in Discord using slash commands.

## Features

- `/say` command to convert text to speech
- Multiple voice options to choose from
- Uses ElevenLabs AI for high-quality voice synthesis
- Simple and intuitive Discord integration
- Configurable voice settings

## Prerequisites

- Node.js (v16 or higher)
- Discord Bot Token
- ElevenLabs API Key
- A Discord server where you have administrator permissions

## Setup

1. Clone this repository:

```bash
git clone https://github.com/VagosTurbo/TalkLikeAI.git
cd TalkLikeAI
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```env
# Discord Bot Configuration
CLIENT_ID=your_discord_client_id_here
GUILD_ID=your_guild_id_here
DISCORD_TOKEN=your_discord_bot_token_here

# ElevenLabs API Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

4. Register the slash commands:

```bash
node deploy-commands.js
```

5. Start the bot:

```bash
node src/index.js
```

## Usage

1. Invite the bot to your Discord server using the OAuth2 URL generated in the Discord Developer Portal
2. Use the `/say` command in any channel:
   ```
   /say text: Hello, this is an AI voice! voice: Rytmus
   ```
3. The bot will join your voice channel and play the generated audio

## Command Reference

### `/say`

Converts text to speech using ElevenLabs AI.

**Options:**

- `text` (required): The text you want to convert to speech
- `voice` (optional): The voice to use for the speech. Defaults to George if not specified.

**Available Voices:**

- Robert Fico
- Rytmus
- Separ
- Rachellka
- Restt
- Boborovský
- Arnold
- Adam
- Sam
- Callum
- Patrick
- Harry
- Lily
- Thomas
- Charlie
- George (default)
- Emily
- Clyde
- Paul
- Arthur
- Kyle

## Acknowledgments

- [Discord.js](https://discord.js.org/) for the Discord API wrapper
- [ElevenLabs](https://elevenlabs.io/) for the text-to-speech API

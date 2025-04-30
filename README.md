# TalkLikeAI Discord Bot

A Discord bot that converts text to speech using ElevenLabs AI voice synthesis. This bot allows users to generate AI voices directly in Discord using slash commands.

## Features

- `/say` command to convert text to speech
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
git clone https://github.com/yourusername/TalkLikeAI.git
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
   /say text: Hello, this is an AI voice!
   ```
3. The bot will generate the voice and respond with the audio

## Command Reference

### `/say`
Converts text to speech using ElevenLabs AI.

**Options:**
- `text` (required): The text you want to convert to speech

## Configuration

You can modify the following settings in the code:

- Voice model and settings in `src/utils/elevenlabs.js`
- Command configurations in `src/commands/say.js`
- Bot settings in `src/config.js`

## Troubleshooting

If you encounter any issues:

1. Check that your Discord bot token and ElevenLabs API key are correct
2. Ensure the bot has the necessary permissions in your Discord server
3. Verify that the slash commands are properly registered
4. Check the console for any error messages

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Discord.js](https://discord.js.org/) for the Discord API wrapper
- [ElevenLabs](https://elevenlabs.io/) for the text-to-speech API

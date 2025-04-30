// Import required Discord.js modules and configuration
const { Client, GatewayIntentBits, Collection, Intents } = require('discord.js');
const { token } = require('./config');
const fs = require('node:fs');
const path = require('node:path');

// Create a new Discord client with required intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates] });

// Create a collection to store commands
client.commands = new Collection();

// Get the path to the commands directory
const commandsPath = path.join(__dirname, 'commands');

// Read all .js files from the commands directory
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load each command file into the commands collection
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Only add commands that have both data and execute properties
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// Event handler for when the bot is ready
client.once('ready', () => {
    console.log('Bot is ready!');
});

// Event handler for slash command interactions
client.on('interactionCreate', async interaction => {
    // Only handle chat input commands
    if (!interaction.isChatInputCommand()) return;

    // Get the command from the commands collection
    const command = client.commands.get(interaction.commandName);

    // If command doesn't exist, do nothing
    if (!command) return;

    try {
        // Execute the command
        await command.execute(interaction, client);
    } catch (error) {
        // Log error and notify user if something goes wrong
        console.error(error);
        // await interaction.reply({ 
        //     content: 'There was an error while executing this command!', 
        //     ephemeral: true 
        // });
    }
});

// Login to Discord with the bot token
client.login(token); 
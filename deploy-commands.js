// Import required Discord.js modules and configuration
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('./src/config.js');
const fs = require('node:fs');
const path = require('node:path');

// Array to store all command data
const commands = [];

// Get the path to the commands directory
const commandsPath = path.join(__dirname, 'src', 'commands');

// Read all .js files from the commands directory
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load each command file and add its data to the commands array
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Only add commands that have both data and execute properties
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
}

// Create a new REST client and set the token
const rest = new REST().setToken(token);

// Immediately invoked async function to deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Deploy commands to the specified guild
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})(); 
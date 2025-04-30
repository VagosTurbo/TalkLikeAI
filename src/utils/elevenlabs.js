// Import ElevenLabs API key from config
const { elevenLabsApiKey } = require('../config');
const { ElevenLabsClient } = require("elevenlabs");

/**
 * Generates voice audio from text using ElevenLabs API
 * @param {string} text - The text to convert to speech
 * @param {string} voiceId - The ID of the voice to use
 * @returns {Promise<Buffer>} - Audio buffer containing the generated voice
 */
async function generateVoice(text, voiceId = "JBFqnCBsd6RMkjVDRZzb") {
    const client = new ElevenLabsClient({ apiKey: elevenLabsApiKey, xiApiKey: elevenLabsApiKey });
    if (!client) {
        throw new Error("ElevenLabs client not initialized");
    }

    const response = await client.textToSpeech.convert(voiceId, {
        output_format: "mp3_44100_128",
        text: text,
        // model_id: "eleven_multilingual_v2",  // more expensive, but better quality
        model_id: "eleven_flash_v2_5"
    });

    if (!response) {
        throw new Error("ElevenLabs API error");
    }

    // The response is already a Buffer, so we can return it directly
    return response;
}

// Export the generateVoice function
module.exports = {
    generateVoice
}; 
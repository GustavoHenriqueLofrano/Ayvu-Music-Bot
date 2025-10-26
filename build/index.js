import { bootstrap } from "#base";
import { Player } from "discord-player";
import { SpotifyExtractor } from "discord-player-spotify";
import { DefaultExtractors } from "@discord-player/extractor";
import { YoutubeSabrExtractor } from 'discord-player-googlevideo';
import { Client, GatewayIntentBits, Partials } from "discord.js";
import "dotenv/config";
import createDisconnectEvent from "./discord/events/disconnect.js";
import createPlayingNowEvent from "./discord/events/playingNow.js";
// Client principal
const client = new Client({
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
    ],
});
// Player principal
const player = new Player(client, {
    skipFFmpeg: false,
    blockStreamFrom: [],
    blockExtractors: [],
});
await player.extractors.register(YoutubeSabrExtractor, {});
await player.extractors.loadMulti(DefaultExtractors);
await player.extractors.register(SpotifyExtractor, {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
// Bootstrap da base do bot
await bootstrap({
    meta: import.meta,
    modules: process.env.GUILD_ID ? [process.env.GUILD_ID] : undefined,
});
// Events
createPlayingNowEvent();
createDisconnectEvent();
// Login
client.login(process.env.BOT_TOKEN);

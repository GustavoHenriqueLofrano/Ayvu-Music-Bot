import { bootstrap } from "#base";
import { Player } from "discord-player";
import { SpotifyExtractor } from "discord-player-spotify";
import { YoutubeiExtractor } from "discord-player-youtubei";
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
const player = new Player(client as never, {
  skipFFmpeg: false,
});
await player.extractors.register(SpotifyExtractor, {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
await player.extractors.register(YoutubeiExtractor, {
  cookie: process.env.YOUTUBE_COOKIE,
  useYoutubeDL: true,
  streamOptions: {
    highWaterMark: 1024 * 1024 * 64,
  },
  overrideDownloadOptions: {
    quality: 'bestefficiency',
    format: 'mp4',
  },
});
await bootstrap({
  meta: import.meta,
  modules: process.env.GUILD_ID ? [process.env.GUILD_ID] : undefined,
});

// erros
player.events.on('playerError', (_queue: any, error: any) => {
  console.error(`[Player Error]: ${error.message}`);
  console.error(error);
});

player.events.on('error', (_queue: any, error: any) => {
  console.error(`[Error]: ${error.message}`);
  console.error(error);
});

// Events
createPlayingNowEvent();
createDisconnectEvent();

// Login
client.login(process.env.BOT_TOKEN);
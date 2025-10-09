import { bootstrap } from "#base";
import { DefaultExtractors } from "@discord-player/extractor"
import { SpotifyExtractor } from "discord-player-spotify";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { SoundcloudExtractor } from "discord-player-soundcloud"
import createPlayingNowEvent from "./discord/events/playingNow.js"
import createDisconnectEvent from "./discord/events/disconnect.js";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import "dotenv/config";

//client principal
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

//player principal
const player = new Player(client as never, {
  skipFFmpeg: false,
  blockStreamFrom: [],
  blockExtractors: []
});

// Promise para carregar os extractors
await Promise.all([
  player.extractors.register(SoundcloudExtractor, {}),
  player.extractors.register(SpotifyExtractor, {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  }),
  player.extractors.loadMulti(DefaultExtractors),
  player.extractors.register(YoutubeiExtractor, {
    generateWithPoToken: true,
    streamOptions: {
      highWaterMark: 1024,
      useClient: "WEB_EMBEDDED",
    },
    innertubeConfigRaw: {
      player_id: '0004de42'
    },
    cookie: process.env.YT_COOKIES,
  })])


//bootstrap da base do bot
await bootstrap({
  meta: import.meta,
  modules: process.env.GUILD_ID ? [process.env.GUILD_ID] : undefined,

});

//events
createPlayingNowEvent();
createDisconnectEvent()


client.login(process.env.BOT_TOKEN);
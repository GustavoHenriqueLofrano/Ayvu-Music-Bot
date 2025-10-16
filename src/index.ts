import { bootstrap } from "#base";
import { DefaultExtractors } from "@discord-player/extractor"
import { SpotifyExtractor } from "discord-player-spotify";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { Innertube } from "youtubei.js";
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

(async () => {
  try {
    const yt = await Innertube.create();
    console.log("✅ YouTube Innertube iniciado:", yt.session.context.client.clientVersion);
  } catch (err) {
    console.error(err);
  }
})();


// Promise para carregar os extractors
await Promise.all([
  player.extractors.register(SpotifyExtractor, {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  }),
  player.extractors.loadMulti(DefaultExtractors),
  player.extractors.register(YoutubeiExtractor, {
    streamOptions: {
      highWaterMark: 1024,
      useClient: "TV", // usar TV ou WEM_EMBEDDED
    },
    innertubeConfigRaw: {
      player_id: '0004de42'
    },

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
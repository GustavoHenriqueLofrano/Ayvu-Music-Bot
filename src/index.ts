import { bootstrap } from "#base";
import { AttachmentExtractor,} from "@discord-player/extractor";
import { SoundcloudExtractor } from "discord-player-soundcloud";
import { SpotifyExtractor } from "discord-player-spotify";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import createPlayingNowEvent from "discord/events/playingNow.js";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import "dotenv/config";

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

const player = new Player(client as never, {
  skipFFmpeg: false,
});

await player.extractors.register(SpotifyExtractor, {
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

await player.extractors.register(SoundcloudExtractor, {});

await player.extractors.register(AttachmentExtractor, {});

await player.extractors.register(YoutubeiExtractor, {
  generateWithPoToken: true,
  streamOptions: {
    highWaterMark: 2048,
    useClient: "WEB_EMBEDDEDB",
  },
  innertubeConfigRaw: {
    player_id: '0004de42',  
  },
  ignoreSignInErrors: true,
  cookie: process.env.YT_COOKIES,
});

await bootstrap({
  meta: import.meta,
  modules: process.env.GUILD_ID ? [process.env.GUILD_ID] : undefined,

});

createPlayingNowEvent();


client.login(process.env.BOT_TOKEN);
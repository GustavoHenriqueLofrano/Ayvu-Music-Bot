import { bootstrap } from "./discord/base/index.js";
import { AttachmentExtractor, } from "@discord-player/extractor";
import { SoundcloudExtractor } from "discord-player-soundcloud";
import { SpotifyExtractor } from "discord-player-spotify";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import createPlayingNowEvent from "./discord/events/playingNow.js";
import { Client } from "discord.js";
import "dotenv/config";
const client = new Client({
    intents: [
        'GuildVoiceStates',
        'GuildMessages',
        'MessageContent',
        'GuildMembers',
        'Guilds',
    ],
});
const player = new Player(client);
createPlayingNowEvent();
await player.extractors.register(SoundcloudExtractor, {});
await player.extractors.register(SpotifyExtractor, {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
await player.extractors.register(YoutubeiExtractor, {
    generateWithPoToken: true,
    streamOptions: {
        highWaterMark: 1 << 25,
        useClient: true,
    },
    ignoreSignInErrors: true,
    cookie: process.env.YT_COOKIES,
});
await player.extractors.register(AttachmentExtractor, {});
await bootstrap({
    meta: import.meta,
    modules: process.env.GUILD_ID ? [process.env.GUILD_ID] : undefined,
});
client.login(process.env.BOT_TOKEN);

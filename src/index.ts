import { bootstrap } from "#base";
import { AttachmentExtractor, DefaultExtractors, SpotifyExtractor, } from "@discord-player/extractor";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";


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

const player = new Player(client as never);

await player.extractors.loadMulti(DefaultExtractors);
await player.extractors.register(YoutubeiExtractor, {});
await player.extractors.register(SpotifyExtractor, {})
await player.extractors.register(AttachmentExtractor, {})



await bootstrap({
  meta: import.meta,
  modules: process.env.GUILD_ID ? [process.env.GUILD_ID] : undefined,

});


client.login(process.env.BOT_TOKEN);


import { bootstrap } from "#base";
import { AttachmentExtractor, DefaultExtractors, SoundCloudExtractor, SpotifyExtractor, } from "@discord-player/extractor";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";
import { YandexMusicExtractor } from "discord-player-yandexmusic";
import { TTSExtractor } from "discord-player-tts";


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
await player.extractors.register(YandexMusicExtractor, {});
await player.extractors.register(TTSExtractor, {language: "en", slow: false});
await player.extractors.register(SoundCloudExtractor, {});


await bootstrap({
  meta: import.meta,
  modules: process.env.GUILD_ID ? [process.env.GUILD_ID] : undefined,

});


client.login(process.env.BOT_TOKEN);


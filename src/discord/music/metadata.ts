import { GuildQueue } from "discord-player";
import {Client, Guild, GuildTextBasedChannel, VoiceBasedChannel} from "discord.js"

export interface QueueMetadata {
    client: Client<true>;
    guild: Guild;
    channel: GuildTextBasedChannel;
    voiceChannel: VoiceBasedChannel;
}
export function createQueueMetadata(metadata: QueueMetadata){
    return metadata
}
export function getQueueMetadata(queue: GuildQueue): QueueMetadata | null {
    return (queue.metadata ?? null) as QueueMetadata | null;
}

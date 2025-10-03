import { useMainPlayer } from "discord-player";
import { EmbedBuilder } from "discord.js";

export default function createDisconnectEvent() {
    const player = useMainPlayer();

    player.events.on("disconnect", (queue) => {
        const channel = queue.metadata.channel;

        const embed = new EmbedBuilder()
            .setTitle("Sai do canal de ... 👋Tchau!")
            .setColor(0xED4245)

        channel.send({ embeds: [embed] });
    });
}

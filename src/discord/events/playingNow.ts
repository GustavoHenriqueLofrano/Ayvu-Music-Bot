import { useMainPlayer } from "discord-player";
import { EmbedBuilder, TextChannel, User } from "discord.js";

export default function createPlayingNowEvent() {
    const player = useMainPlayer();

    player.events.on("playerStart", (queue, track) => {
        const channel = queue.metadata.channel as TextChannel;

        const embed = new EmbedBuilder()
            .setTitle("🎸 Tocando Agora!")
            .setDescription(`[${track.title}](${track.url})`)
            .addFields(
                { name: "Autor", value: track.author, inline: true },
                { name: "Duração", value: track.duration, inline: true }
            )
            .setColor(0xF72585)
            .setThumbnail(track.thumbnail)

        channel.send({ embeds: [embed] });
    });
}

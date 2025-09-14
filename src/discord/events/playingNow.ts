import { useMainPlayer } from "discord-player";
import { EmbedBuilder, TextChannel, User } from "discord.js";

export default function createPlayingNowEvent() {
    const player = useMainPlayer();

    player.events.on("playerStart", (queue, track) => {
        const channel = queue.metadata.channel as TextChannel;

        const requester = (track.requestedBy ?? queue.metadata.requestedBy) as User;

        const embed = new EmbedBuilder()
            .setTitle("🎵  Tocando Agora!")
            .setDescription(`[${track.title}](${track.url}) • ${track.author}`)
            .setColor(0xF72585)
            .addFields({
                name: "Duração",
                value: track.duration,
                inline: true,
            })
            .setThumbnail(track.thumbnail)
            .setFooter({
                text: `Pedido por ${requester.tag}`,
                iconURL: requester.displayAvatarURL(),
            });

        channel.send({ embeds: [embed] });
    });
}

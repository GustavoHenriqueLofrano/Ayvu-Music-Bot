import { useMainPlayer } from "discord-player";
import { EmbedBuilder } from "discord.js";
export default function createPlayingNowEvent() {
    const player = useMainPlayer();
    player.events.on("playerStart", (queue, track) => {
        const channel = queue.metadata.channel;
        const requester = (queue.metadata.requestedBy);
        const embed = new EmbedBuilder()
            .setTitle("  Tocando Agora!")
            .setDescription(`[${track.title}](${track.url})`)
            .addFields({ name: "Autor", value: track.author, inline: true }, { name: "Duração", value: track.duration, inline: true })
            .setColor(0xF72585)
            .setThumbnail(track.thumbnail)
            .setFooter({
            text: `Pedido por ${requester.tag}`,
            iconURL: requester.displayAvatarURL(),
        });
        channel.send({ embeds: [embed] });
    });
}

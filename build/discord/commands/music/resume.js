import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";
import formatDuration from "#functions";
export default createCommand({
    name: "resume",
    description: "Retoma a música pausada",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);
        await interaction.deferReply();
        if (!queue || !queue.currentTrack) {
            await interaction.editReply("😕 Nenhuma música tocando no momento");
            return;
        }
        try {
            const wasPaused = queue.node.isPaused();
            if (wasPaused)
                queue.node.resume();
            const embed = new EmbedBuilder()
                .setColor(0x3A0CA3)
                .setDescription(wasPaused
                ? "▶️ Música retomada"
                : "▶️ A música já está tocando")
                .addFields({ name: "Música", value: `[${queue.currentTrack.title}](${queue.currentTrack.url})` }, { name: "Posição", value: formatDuration(queue.node.getTimestamp()?.current.value || 0) });
            await interaction.editReply({ embeds: [embed] });
        }
        catch (error) {
            console.error("Erro no comando /resume:", error);
            await interaction.editReply("❌ Ocorreu um erro ao retomar a música");
            return;
        }
    },
});

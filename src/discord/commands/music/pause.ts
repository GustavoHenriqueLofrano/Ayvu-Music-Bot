import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";

export default createCommand({
    name: "pause",
    description: "Pausa a música atual",
    type: ApplicationCommandType.ChatInput,
    async run(interaction): Promise<void> {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId as never);

        // Defer a resposta inicialmente
        await interaction.deferReply({ ephemeral: true });

        if (!queue || !queue.currentTrack) {
            await interaction.editReply("😕 Nenhuma música tocando");
            return;
        }

        try {
            const wasPaused = queue.node.isPaused();
            if (!wasPaused) queue.node.pause();

            queue.metadata = {
                pausedTrack: {
                    track: queue.currentTrack,
                    position: queue.node.getTimestamp()?.current.value || 0,
                    timestamp: Date.now()
                }
            };

            const embed = new EmbedBuilder()
                .setColor(0x3A0CA3)
                .setDescription(wasPaused ? "⏸️ Música já estava pausada" : "⏸️ Música pausada")
                .addFields(
                    { name: "Música", value: `[${queue.currentTrack.title}](${queue.currentTrack.url})` },
                    { name: "Posição", value: formatDuration(queue.node.getTimestamp()?.current.value || 0) }
                );

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Erro no comando /stop:", error);
            await interaction.editReply("❌ Ocorreu um erro ao pausar a música");
        }
    },
});

// Função de utilidade
function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

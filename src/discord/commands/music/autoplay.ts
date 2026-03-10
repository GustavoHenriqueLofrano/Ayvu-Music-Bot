import { createCommand } from "#base";
import { useMainPlayer, QueueRepeatMode} from "discord-player";
import { ApplicationCommandType} from "discord.js";

export default createCommand({
    name: "autoplay",
    description: "Ativa/desativa a reprodução automática de músicas parecidas",
    type: ApplicationCommandType.ChatInput,
    async run(interaction): Promise<void> {
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guildId as never);

    if (!queue || !queue.isPlaying()) {
        await interaction.reply({
            content: "😕 Nenhuma música tocando no momento",
            ephemeral: true
        });
        return;
    }

    await interaction.deferReply();

    try {
        const isAutoplay = queue.repeatMode === QueueRepeatMode.AUTOPLAY;
        
        if (isAutoplay) {
            await queue.setRepeatMode(QueueRepeatMode.OFF);
            await interaction.editReply("❌ Autoplay desativado!");
        } else {
            // Enable autoplay with related videos
            await queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            await interaction.editReply("🔀 Autoplay ativado! O bot irá tocar músicas relacionadas automaticamente.");
        }

    } catch (error) {
        console.error("Erro no comando /autoplay:", error);
        await interaction.editReply({
            content: "❌ Ocorreu um erro ao ativar/desativar a reprodução automática"
        });
    }
}
});
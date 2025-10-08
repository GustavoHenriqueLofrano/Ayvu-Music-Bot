import { createCommand } from "#base";
import { useMainPlayer, QueueRepeatMode } from "discord-player";
import { ApplicationCommandType } from "discord.js";
export default createCommand({
    name: "autoplay",
    description: "Ativa/desativa a reprodução automática de músicas parecidas",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.currentTrack) {
            await interaction.reply({
                content: "😕 Nenhuma música tocando no momento",
                ephemeral: true
            });
            return;
        }
        await interaction.deferReply();
        try {
            const isAutoplay = queue.repeatMode === QueueRepeatMode.AUTOPLAY;
            let description = "";
            if (isAutoplay) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                description = "❌ Autoplay desativado!";
            }
            else {
                queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                description = `🔀 Autoplay ativado!`;
            }
            await interaction.editReply(description);
        }
        catch (error) {
            console.error("Erro no comando /autoplay:", error);
            await interaction.editReply({
                content: "❌ Ocorreu um erro ao ativar/desativar a reprodução automática"
            });
        }
    }
});

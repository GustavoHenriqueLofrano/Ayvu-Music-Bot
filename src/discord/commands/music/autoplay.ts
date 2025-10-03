import { createCommand } from "#base";
import { useMainPlayer, QueueRepeatMode } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";

export default createCommand({
    name: "autoplay",
    description: "Ativa/desativa a reprodução automática de músicas parecidas",
    type: ApplicationCommandType.ChatInput,
    async run(interaction): Promise<void> {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId as never);

        if (!queue || !queue.currentTrack) {
            await interaction.reply({
                content: "😕 Nenhuma música tocando no momento",
                ephemeral: true
            });
            return
        }

        await interaction.deferReply();

        try {
            const isAutoplay = queue.repeatMode === QueueRepeatMode.AUTOPLAY;
            let description = "";

            if (isAutoplay) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                description = "❌ Modo de reprodução automática desativado";
            } else {
                queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                description = `✅ Modo de reprodução automática ativado\nBaseado em: ${queue.currentTrack.title}`;
            }

            const embed = new EmbedBuilder()
                .setColor(0x3A0CA3)
                .setDescription(description);

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Erro no comando /autoplay:", error);
            await interaction.editReply({
                content: "❌ Ocorreu um erro ao ativar/desativar a reprodução automática"
            });
        }
    }
});

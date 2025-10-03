import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";


export default createCommand({
    name: "skip",
    description: "Pula a música atual",
    type: ApplicationCommandType.ChatInput,
    async run(interaction): Promise<void> {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId as never);

        if (!queue) {
            await interaction.reply({
                content: "😕 Nenhuma música tocando",
                ephemeral: true,
            });
            return;
        }
        try {
            const sucess = queue.node.skip();
            const nextTrack = queue.history.nextTrack

            if (!sucess) {
                await interaction.reply({
                    content: "😕 Nenhuma música tocando",
                    ephemeral: true,
                })
                return
            }
            if (!queue || !nextTrack) {
                await interaction.reply({
                    content: "😕 Nenhuma música na fila",
                    ephemeral: true,
                })
                return  
            }
            if (sucess) {
                const embed = new EmbedBuilder()
                .setColor(0x3A0CA3)
                .setDescription("⏩ Música pulada")

                interaction.editReply({embeds: [embed]})
                return
            }
        }catch (err) {
            console.error("Erro no comando /skip:", err);
        }

    }
});
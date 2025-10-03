import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";

export default createCommand({
    name: "previous",
    description: "Volta para a música anterior",
    type: ApplicationCommandType.ChatInput,
    async run(interaction): Promise<void> {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId as never);

        if (!queue || !queue.currentTrack) {
            await interaction.reply({
                content: "😕 Nenhuma música tocando",
                ephemeral: true,
            });
            return
        }
        if (!queue.history.previousTrack) {
            await interaction.reply({
                content: "😕 Nenhuma música anterior",
                ephemeral: true,
            });
            return
        }
        try{
            await queue.history.back()

            const embed = new EmbedBuilder()
                .setColor(0x3A0CA3)
                .setDescription("⏮️ Voltando para a música anterior")

            await interaction.reply({embeds: [embed]})

        }catch(err){
            console.error(err);
            await interaction.reply({
                content: "😵 Ocorreu um erro ao tentar voltar para a música anterior",
                ephemeral: true,
            })
        }

        
    }
});

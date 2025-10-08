import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";
export default createCommand({
    name: "skip",
    description: "Pula para a próxima música da fila",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);
        if (!queue || !queue.currentTrack) {
            await interaction.reply({
                content: "😕 Nenhuma música tocando",
                ephemeral: true,
            });
            return;
        }
        try {
            queue.node.skip();
            const embed = new EmbedBuilder()
                .setColor(0x3A0CA3)
                .setDescription("⏩ Pulando para a próxima música");
            await interaction.reply({ embeds: [embed], ephemeral: false });
        }
        catch (err) {
            console.error(err);
            await interaction.reply({
                content: "😵 Ocorreu um erro ao tentar pular para a próxima música",
                ephemeral: true,
            });
        }
    }
});

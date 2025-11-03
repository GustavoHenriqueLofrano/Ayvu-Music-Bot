import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";

export default createCommand({
    name: "random",
    description: "Ativa o modo aleatório",
    type: ApplicationCommandType.ChatInput,
    async run(interaction): Promise<void> {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId as never);

        if (!queue || !queue.currentTrack) {
            await interaction.reply({ content: "😕 Nenhuma música tocando", ephemeral: true });
            return;
        }
        if (queue.tracks.size < 2){
            await interaction.reply({ content: "😕 A fila precisa ter pelo menos 2 músicas para ativar o modo aleatório", ephemeral: true });
            return;
        }
        const shuffleOn = queue.toggleShuffle();
        
        const embed = new EmbedBuilder()
            .setColor(0x3A0CA3)
            .setDescription(shuffleOn ? "🔀 Modo aleatório ativado!" : "🔀 Modo aleatório desativado!")
        await interaction.reply({ embeds: [embed] });
    }
});


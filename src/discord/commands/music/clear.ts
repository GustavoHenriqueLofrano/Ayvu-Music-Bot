import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType, EmbedBuilder } from "discord.js";

export default createCommand({
  name: "clear",
  description: "Limpa as próximas músicas da fila",
  type: ApplicationCommandType.ChatInput,
  async run(interaction): Promise<void> {
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guildId as never);

    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        content: "😕 Nenhuma música na fila",
        ephemeral: true,
      });
      return;
    }

    try {
      queue.clear();

      const embed = new EmbedBuilder()
        .setColor(0x3A0CA3)
        .setDescription("🗑️ Fila Limpa")
      
      await interaction.reply({ embeds: [embed] });
      
    } catch (err) {
      console.error("Erro no comando /clear:", err);
      await interaction.reply({
        content: "😕 Algo deu errado ao limpar a fila.",
        ephemeral: true,
      })
    }
  }
})
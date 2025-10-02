import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType} from "discord.js";

export default createCommand({
    name: "clear",
    description: "limpa a fila de músicas",
    type: ApplicationCommandType.ChatInput,
    async run(interaction): Promise<void>{
        try {
            const player = useMainPlayer();
            const queue = player.nodes.get(interaction.guildId as never);

    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        content: "😕 Nenhuma música na fila",
        ephemeral: true,
      });
      return;
    }

    queue.clear();
    await interaction.reply({
        content: "🎶 Fila limpa!",
        ephemeral: false,
        })
   }catch (err) {
    console.error("Erro no comando /clear:", err);
    await interaction.reply({
        content: "😕 Algo deu errado ao limpar a fila.",
        ephemeral: true,
    })
   }
}})
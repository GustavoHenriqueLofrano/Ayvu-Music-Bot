import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType } from "discord.js";
export default createCommand({
    name: "skip",
    description: "pula a música atual",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);
        if (!queue) {
            await interaction.reply({
                content: "😕 Nenhuma música tocando",
                ephemeral: true,
            });
            return;
        }
        try {
            const sucess = queue.node.skip();
            if (!sucess) {
                await interaction.reply({
                    content: "😕 Nenhuma música tocando",
                    ephemeral: false,
                });
            }
            if (sucess) {
                await interaction.reply({
                    content: "⏩  Música pulada",
                    ephemeral: false
                });
            }
        }
        catch (err) {
            console.error("Erro no comando /skip:", err);
        }
    }
});

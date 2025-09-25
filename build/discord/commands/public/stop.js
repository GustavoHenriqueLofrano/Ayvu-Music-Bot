import { createCommand } from "../../base/index.js";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType } from "discord.js";
export default createCommand({
    name: "stop",
    description: "para a música atual",
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId);
        if (!queue) {
            await interaction.reply({
                content: "😕 Nenhuma música tocando",
                ephemeral: true,
            });
        }
    }
});

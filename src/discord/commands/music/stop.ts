import {createCommand} from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType } from "discord.js";

export default createCommand({
    name: "stop",
    description: "Para a reprodução e sai da chamada",
    type: ApplicationCommandType.ChatInput,
    async run(interaction): Promise<void> {
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId as never);

        await interaction.deferReply();

        if (!queue || !queue.currentTrack) {
            await interaction.editReply("😕 Nenhuma música tocando");
            return;
        }

        try {
            queue.delete();
            await interaction.editReply("😵 Reprodução encerrada!");
        } catch (error) {
            console.error("Erro no comando /stop:", error);
            await interaction.editReply("❌ Ocorreu um erro ao parar a música");
        }
    },
});

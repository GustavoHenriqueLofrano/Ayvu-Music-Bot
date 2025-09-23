import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType } from "discord.js";

export default createCommand({
    name: "queue",
    description: "queue command",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId as never);
        
        if(!queue){
            return interaction.reply({
                content: "😕 Nenhuma música tocando",
                ephemeral: true,
            })
        
        }
        
    }
});
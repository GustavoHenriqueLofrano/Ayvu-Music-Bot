import { createCommand } from "#base";
import { ApplicationCommandType } from "discord.js";
import { useMainPlayer } from "discord-player";


export default createCommand({
    name: "stop",
    description: "para a música atual",
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
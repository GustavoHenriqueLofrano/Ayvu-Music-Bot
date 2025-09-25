import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";


export default createCommand({
    name: "stop",
    description: "para a música atual",
    type: ApplicationCommandType.ChatInput,
    async run (interaction: ChatInputCommandInteraction<"cached">): Promise<void>{
            const player = useMainPlayer();
            const queue = player.nodes.get(interaction.guildId as never);
            
            if(!queue){
                await interaction.reply({
                    content: "😕 Nenhuma música tocando",
                    ephemeral: true,
                })
            }
        
        
    }
});
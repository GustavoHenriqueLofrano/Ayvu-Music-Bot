import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType } from "discord.js";


export default createCommand({
    name: "skip",
    description: "pula a música atual",
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
        
        try{
            const sucess = queue.node.skip();
            if(!sucess){
                return interaction.reply({
                    content: "😕 Nenhuma música tocando",
                    ephemeral: true,
                })
            }
            if(sucess){
                return interaction.reply({
                    content: "⏩  Música pulada",
                    ephemeral: true
                })
            }
        }catch(err){
            console.error("Erro no comando /skip:", err);
        }
         
    }
});
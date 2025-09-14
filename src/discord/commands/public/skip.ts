import { createCommand } from "#base";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType } from "discord.js";


export default createCommand({
    name: "stop",
    description: "stop command",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const player = useMainPlayer();
        
        player.asdasda
        
        
    }
});
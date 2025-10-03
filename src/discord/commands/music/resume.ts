import { createCommand } from "#base";
import { ApplicationCommandType } from "discord.js";

createCommand({
    name: "resume",
    description: "Retoma a música",
    type: ApplicationCommandType.ChatInput,
    async run(interaction): Promise<void>{
        
    }
});
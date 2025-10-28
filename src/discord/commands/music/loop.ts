import { createCommand } from "#base";
import { useMainPlayer, QueueRepeatMode } from "discord-player";
import { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default createCommand({
    name: "loop",
    description: "Define o modo de repetição",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "modo",
            description: "Escolha repetir a música atual ou a fila inteira",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "Música atual", value: "track" },
                { name: "Fila inteira", value: "queue" },
                { name: "Desativar loop", value: "off" },
            ],
        },
    ],
    async run(interaction): Promise<void>  {
        const modo = interaction.options.getString("modo");
        const player = useMainPlayer();
        const queue = player.nodes.get(interaction.guildId as never);

        if (!queue || !queue.currentTrack) {
            await interaction.reply({
                content: "😕 Nenhuma música tocando no momento",
                ephemeral: true,
            });
            return;
        }

        try {
            let repeatMode: QueueRepeatMode;
            let description: string;

            switch (modo) {
                case "track":
                    repeatMode = QueueRepeatMode.TRACK;
                    description = `🔁 Repetindo a música atual: **${queue.currentTrack.title}**`;
                    break;
                case "queue":
                    repeatMode = QueueRepeatMode.QUEUE;
                    description = "🔁 Repetindo toda a fila";
                    break;
                case "off":
                default:
                    repeatMode = QueueRepeatMode.AUTOPLAY
                    ? QueueRepeatMode.AUTOPLAY
                    : QueueRepeatMode.OFF;
                    description = repeatMode === QueueRepeatMode.AUTOPLAY
                    ? "🔁 Loop desativado, mas autoplay continua"
                    : "❌ Repetição desativada"
                    break;
            }

            if (queue.repeatMode === repeatMode) {
                await interaction.reply({
                    content: `ℹ️ O modo de repetição já está definido como **${modo === "off" ? "desativado" : modo === "track" ? "música atual" : "fila inteira"}**.`,
                    ephemeral: true,
                });
                return;
            }

            queue.setRepeatMode(repeatMode);

            const embed = new EmbedBuilder()
                .setColor(0x3A0CA3)
                .setDescription(description);

            await interaction.reply({ embeds: [embed] });
        } catch (err) {
            console.error("Erro no comando /loop:", err);
            await interaction.reply({
                content: "❌ Ocorreu um erro ao alterar o modo de repetição",
                ephemeral: true,
            });
        }
    },
});
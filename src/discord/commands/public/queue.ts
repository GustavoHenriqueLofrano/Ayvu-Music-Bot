import { createCommand } from "#base";
import { EmbedBuilder } from "@discordjs/builders";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";

export default createCommand({
  name: "queue",
  description: "Mostra a fila de músicas",
  type: ApplicationCommandType.ChatInput,

  async run(interaction: ChatInputCommandInteraction<"cached">): Promise<void> {
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guildId as never);

    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        content: "😕 Nenhuma música está tocando agora.",
        ephemeral: true,
      });
      return;
    }

    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.toArray(); // pega as próximas músicas

    const embed = new EmbedBuilder()
      .setColor(0x3a0ca3)
      .setTitle("🎶 Fila")
      .addFields(
        {
          name: "Tocando Agora",
          value: `[${currentTrack.title}](${currentTrack.url}) • \`${currentTrack.duration}\``,
        },
        {
          name: "Próximas",
          value:
            tracks.length > 0
              ? tracks
                  .slice(0, 10) // limita
                  .map(
                    (track, i) =>
                      `${i + 1} • [${track.title}](${track.url}) • \`${track.duration}\``
                  )
                  .join("\n")
              : "Nenhuma música na fila",
        }
      )
      .setFooter({
        text: `Pedido por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.reply({ embeds: [embed] });
  },
});

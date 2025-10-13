import formatDuration from "#functions";
import { QueueRepeatMode, useMainPlayer } from "discord-player";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
export default function createPlayingNowEvent() {
    const player = useMainPlayer();
    player.events.on("playerStart", async (queue, track) => {
        const channel = queue.metadata.channel;
        if (!channel)
            return;
        // Detecta autoplay
        const isAutoplay = track.requestedBy === "autoplay" ||
            track.requestedBy?.username === "autoplay";
        // Cria embed
        const embed = new EmbedBuilder()
            .setTitle(isAutoplay ? "🔁 Tocando pelo Autoplay!" : "🎸 Tocando Agora!")
            .setDescription(`[${track.cleanTitle}](${track.url})`)
            .addFields({ name: "Autor", value: track.author || "Desconhecido", inline: true }, { name: "Duração", value: track.duration || "Indefinida", inline: true })
            .setColor(isAutoplay ? 0x4cc9f0 : 0xf72585)
            .setThumbnail(track.thumbnail || null);
        const buttons = new ActionRowBuilder().addComponents(new ButtonBuilder()
            .setCustomId("back")
            .setEmoji("⏮️")
            .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
            .setCustomId("pause_resume")
            .setEmoji("⏯️")
            .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
            .setCustomId("skip")
            .setEmoji("⏭️")
            .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
            .setCustomId("loop")
            .setEmoji("🔁")
            .setStyle(ButtonStyle.Secondary), new ButtonBuilder()
            .setCustomId("autoplay")
            .setEmoji("🔀")
            .setStyle(ButtonStyle.Secondary));
        const message = await channel.send({
            embeds: [embed],
            components: [buttons],
        });
        const collector = message.createMessageComponentCollector({
            time: track.durationMS || 10 * 60 * 1000, // ate 10 min
        });
        collector.on("collect", async (interaction) => {
            if (!interaction.isButton())
                return;
            if (interaction.user.bot)
                return;
            const player = useMainPlayer();
            const queue = player.nodes.get(interaction.guildId);
            if (!queue) {
                await interaction.reply({ content: "❌ Nenhuma música tocando.", ephemeral: true });
                return;
            }
            let buttonEmbed;
            switch (interaction.customId) {
                case "pause_resume":
                    if (queue.node.isPaused()) {
                        queue.node.resume();
                    }
                    else {
                        queue.node.pause();
                    }
                    buttonEmbed = new EmbedBuilder()
                        .setColor(0x3A0CA3)
                        .setDescription(queue.node.isPaused() ? "⏸️ Música pausada!" : "▶️ Música tocando!")
                        .addFields({ name: "Música", value: `[${queue.currentTrack?.title}](${queue.currentTrack?.url})` }, { name: "Posição", value: formatDuration(queue.node.getTimestamp()?.current.value || 0) });
                    await interaction.reply({ embeds: [buttonEmbed], ephemeral: false });
                    break;
                case "back":
                    queue.history.back();
                    if (!queue.history.back) {
                        await interaction.reply({ content: "❌ Nenhuma música anterior", ephemeral: true });
                        return;
                    }
                    buttonEmbed = new EmbedBuilder()
                        .setColor(0x3A0CA3)
                        .setDescription("⏮️ Voltando para a música anterior");
                    await interaction.reply({ embeds: [buttonEmbed], ephemeral: false });
                    break;
                case "skip":
                    queue.node.skip();
                    buttonEmbed = new EmbedBuilder()
                        .setColor(0x3A0CA3)
                        .setDescription("⏩ Pulando para a próxima música");
                    await interaction.reply({ embeds: [buttonEmbed], ephemeral: false });
                    break;
                case "loop":
                    let queueMode;
                    let queueMessage;
                    if (queue.repeatMode === QueueRepeatMode.OFF) {
                        queueMode = QueueRepeatMode.TRACK;
                        queueMessage = "🔂 Modo repetição: Música atual";
                    }
                    else if (queue.repeatMode === QueueRepeatMode.TRACK) {
                        queueMode = QueueRepeatMode.QUEUE;
                        queueMessage = "🔁 Modo repetição: Fila inteira";
                    }
                    else if (queue.repeatMode === QueueRepeatMode.QUEUE) {
                        queueMode = QueueRepeatMode.OFF;
                        queueMessage = "➡️ Modo repetição: Desativado";
                    }
                    else {
                        queueMode = QueueRepeatMode.OFF;
                        queueMessage = "➡️ Modo repetição: Desativado";
                    }
                    if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) {
                        queue.setRepeatMode(QueueRepeatMode.OFF);
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    queue.setRepeatMode(queueMode);
                    await interaction.reply({
                        content: queueMessage,
                        ephemeral: false,
                    });
                    break;
                case "autoplay":
                    const autoplayMode = queue.repeatMode === QueueRepeatMode.AUTOPLAY ? 0 : QueueRepeatMode.AUTOPLAY;
                    queue.setRepeatMode(autoplayMode);
                    await interaction.reply({
                        content: autoplayMode ? "🔀 Autoplay ativado!" : "❌ Autoplay desativado!",
                        ephemeral: false,
                    });
                    break;
            }
        });
    });
}

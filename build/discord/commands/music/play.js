import { createCommand } from "#base";
import { EmbedBuilder } from "@discordjs/builders";
import { QueryType, useMainPlayer } from "discord-player";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
export default createCommand({
    name: "play",
    description: "Adiciona uma música ou playlist a fila",
    type: ApplicationCommandType.ChatInput, // IMPORTANTE, verifica o tipo do comando, so funciona se tiver o tipo 1
    options: [
        {
            name: "query",
            description: "Nome ou link",
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "engine",
            description: "engine de busca",
            type: ApplicationCommandOptionType.String,
            required: false,
            choices: Object.values(QueryType).map(i => ({
                name: i,
                value: i
            })),
        }
    ],
    async run(interaction) {
        const player = useMainPlayer();
        const channel = interaction.member.voice.channel;
        if (!channel) {
            await interaction.reply({
                content: "😵 Você precisa estar em um canal de voz.",
                ephemeral: true,
            });
            return;
        }
        const query = interaction.options.getString('query', true);
        await interaction.deferReply();
        const result = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine: interaction.options.getString('engine') || QueryType.YOUTUBE,
        });
        if (!result.hasTracks()) {
            const embed = new EmbedBuilder()
                .setTitle("Nenhum resultado encontrado")
                .setDescription(`Nenhum resultado para \`${query}\``)
                .setColor(0xED4245);
            await interaction.editReply({ embeds: [embed] });
        }
        try {
            const { track, searchResult } = await player.play(channel, result.tracks[0], {
                nodeOptions: {
                    metadata: { interaction, guild: interaction.guild, channel: interaction.channel, requestedBy: interaction.user },
                    bufferingTimeout: 15000,
                    leaveOnStop: true,
                    leaveOnStopCooldown: 60000,
                    leaveOnEnd: true,
                    leaveOnEndCooldown: 60000,
                    leaveOnEmpty: true,
                    leaveOnEmptyCooldown: 60000,
                    selfDeaf: true,
                },
            });
            let embed;
            if (searchResult.hasPlaylist() && searchResult.playlist) {
                const playlist = searchResult.playlist;
                const totalDuration = playlist.tracks.reduce((acc, t) => acc + (t.durationMS || 0), 0);
                const formatDuration = (ms) => {
                    const seconds = Math.floor((ms / 1000) % 60);
                    const minutes = Math.floor((ms / (1000 * 60)) % 60);
                    const hours = Math.floor(ms / (1000 * 60 * 60));
                    if (hours > 0) {
                        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                    else {
                        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    }
                };
                const formattedDuration = formatDuration(totalDuration);
                embed = new EmbedBuilder()
                    .setThumbnail(searchResult.playlist.thumbnail)
                    .setTitle("➕  Playlist adicionada!")
                    .setDescription(`[${playlist.title}](${playlist.url})`)
                    .setColor(0x3A0CA3)
                    .addFields({
                    name: "Músicas",
                    value: `${searchResult.playlist.tracks.length}`,
                    inline: true
                }, {
                    name: "Duração",
                    value: `${formattedDuration}`,
                    inline: true
                })
                    .setFooter({
                    text: `Pedido por ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            }
            else {
                embed = new EmbedBuilder()
                    .setThumbnail(track.thumbnail)
                    .setTitle("➕  Música adicionada!")
                    .setDescription(`[${track.cleanTitle}](${track.url})`)
                    .setColor(0x3A0CA3)
                    .setFooter({
                    text: `Pedido por ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            }
            interaction.editReply({ embeds: [embed] });
        }
        catch (err) {
            console.error("Erro no comando /play:", err);
            const embed = new EmbedBuilder()
                .setTitle("Erro")
                .setDescription(`Algo deu errado ao tocar \`${query}\``)
                .setColor(0xED4245);
            interaction.editReply({ embeds: [embed] });
        }
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused(true).value;
        if (!focusedValue) {
            await interaction.respond([]);
            return;
        }
        const player = useMainPlayer();
        const result = await player.search(focusedValue, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });
        const choices = result.tracks.slice(0, 5).map((track) => ({
            name: track.cleanTitle,
            value: track.url,
        }));
        await interaction.respond(choices);
    }
});

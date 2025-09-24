import { createCommand } from "../../base/index.js";
import { EmbedBuilder } from "@discordjs/builders";
import { useMainPlayer } from "discord-player";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";
export default createCommand({
    name: "play",
    description: "Adiciona uma música ou playlist a fila",
    type: ApplicationCommandType.ChatInput, // IMPORTANTE, verifica o tipo do comando, so funciona se tiver o tipo 1
    options: [
        {
            name: "query",
            description: "Nome ou link",
            type: ApplicationCommandOptionType.String, // tipo 3, string do comando play
            required: true,
        },
    ],
    async run(interaction) {
        // inicializa o player
        const player = useMainPlayer();
        // pega o canal de voz do usuario
        const channel = interaction.member.voice.channel;
        // verifica se esta em um canal de voz
        if (!channel) {
            interaction.reply({
                content: "❌ Você precisa estar em um canal de voz.",
                ephemeral: true,
            });
        }
        // pega a query
        const query = interaction.options.getString('query', true);
        await interaction.deferReply();
        // busca a música
        const result = await player.search(query, {
            requestedBy: interaction.user,
        });
        if (!result.hasTracks()) {
            const embed = new EmbedBuilder()
                .setTitle("Nenhum resultado encontrado")
                .setDescription(`Nenhum resultado para \`${query}\``)
                .setColor(0xED4245);
            await interaction.editReply({ embeds: [embed] });
        }
        try {
            // Opções do player
            const { track, searchResult } = await player.play(channel, result.tracks[0], {
                nodeOptions: {
                    metadata: { interaction, guild: interaction.guild, channel: interaction.channel, requestedBy: interaction.user },
                    selfDeaf: true,
                    leaveOnEmpty: true,
                    leaveOnEnd: true,
                    leaveOnEmptyCooldown: 60000, //1 min
                    leaveOnEndCooldown: 60000,
                    volume: 50,
                },
                requestedBy: interaction.user,
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
                    .setColor(0x3A0CA3)
                    .addFields({ name: "Músicas",
                    value: `${searchResult.playlist.tracks.length}`,
                    inline: true }, { name: "Duração",
                    value: `${formattedDuration}`,
                    inline: true })
                    .setFooter({
                    text: `Pedido por ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            }
            else {
                embed = new EmbedBuilder()
                    .setThumbnail(track.thumbnail)
                    .setTitle("➕  Música adicionada!")
                    .setDescription(`[\`${interaction.options.getString('query', true)}\`]`)
                    .setColor(0x3A0CA3)
                    .setFooter({
                    text: `Pedido por ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            }
            await interaction.editReply({ embeds: [embed] });
        }
        catch (err) {
            console.error("Erro no comando /play:", err);
            const embed = new EmbedBuilder()
                .setTitle("Erro")
                .setDescription(`Algo deu errado ao tocar \`${query}\``)
                .setColor(0xED4245);
            await interaction.editReply({ embeds: [embed] });
        }
    },
});

import { Playlist, useMainPlayer } from "discord-player";
import { createCommand } from "#base";
import { EmbedBuilder } from "@discordjs/builders";
import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";

export default createCommand({
  name: "play",
  description: "Toca uma música",
  type: ApplicationCommandType.ChatInput, // IMPORTANTE, verifica o tipo do comando, so funciona se tiver o tipo 1
  options: [
    {
      name: "query",
      description: "Nome ou link",
      type: ApplicationCommandOptionType.String, // tipo 3, string do comando play
      required: true,
    },
  ],

  run: async (interaction: ChatInputCommandInteraction<"cached">) => {  
    // inicializa o player
    const player = useMainPlayer();
    
    // pega o canal de voz do usuario
    const channel = interaction.member.voice.channel;
    
    // verifica se esta em um canal de voz
    if (!channel) {
      return interaction.reply({
        content: "❌ Você precisa estar em um canal de voz.",
        ephemeral: true,
      });
    }

    // pega a query
    const query = interaction.options.getString('query', true);
    await interaction.deferReply();

    // busca a música
    const result = await player.search(query, {
      requestedBy: interaction.user as never,
    });

    if (!result.hasTracks()) {
      const embed = new EmbedBuilder()
        .setTitle("Nenhum resultado encontrado")
        .setDescription(`Nenhum resultado para \`${query}\``)
        .setColor(0xED4245);

      return interaction.editReply({ embeds: [embed] });
    }

    try {
      // Opções do player
      const { track, searchResult } = await player.play(channel as never, result.tracks[0], {
        nodeOptions: {
          metadata: {interaction, guild: interaction.guild, channel: interaction.channel, requestedBy: interaction.user },
          selfDeaf: true,
          leaveOnEmpty: false,
          leaveOnEnd: false,
          leaveOnEmptyCooldown: 60000, //1 min
          leaveOnEndCooldown: 60000,
          preferBridgedMetadata: true, // usar o metadata do canal de voz

        },
        requestedBy: interaction.user as never,
      });

      let embed: EmbedBuilder;  

      if(searchResult.hasPlaylist() &&searchResult.playlist){
        const playlist = searchResult.playlist;
        const totalDuration = playlist.tracks.reduce(
          (acc, t) => acc + (t.durationMS ?? 0),
          0
        );
        
      
        embed = new EmbedBuilder()
          .setTitle("🎶 Tocando Playlist!")
          .setDescription(`Tocando \`${searchResult.playlist.title}\``)
          .setColor(0x3A0CA3)
          .addFields(
            {name: "Musicas",
            value: `${searchResult.playlist.tracks.length}`,
            inline: true},
            {name: "Duração",
            value:  `${totalDuration}`,
            inline: true}
          )
          .setFooter({
            text: `Pedido por ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()
          })
          
          
          
      }
      else{
        embed = new EmbedBuilder()
          .setTitle("🎸 Tocando música!")
          .setDescription(`Tocando \`${track.title}\``)
          .setColor(0x3A0CA3)
          .addFields({
            name: "Duração",
            value: track.duration,
            inline: true
          })
          .setFooter({
            text: `Pedido por ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL()

          })
          
      }
      
      
        return interaction.editReply({ embeds: [embed] });
    
    
    
    
    
    
    
    
    
    } catch (err) {
      console.error("Erro no comando /play:", err);

      const embed = new EmbedBuilder()
        .setTitle("Erro")
        .setDescription(`Algo deu errado ao tocar \`${query}\``)
        .setColor(0xED4245)

      return interaction.editReply({ embeds: [embed] });
    }
  },
});

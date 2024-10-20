const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('applicationsetup')
        .setDescription('Sets up the application system for Zenta Roleplay'),

    async execute(interaction) {
        const applicationChannel = interaction.guild.channels.cache.get(config.applicationChannelId);
        if (applicationChannel) {
            const applicationEmbed = new EmbedBuilder()
                .setColor(0x2ecc71)
                .setTitle('Application Process Started')
                .setDescription('Please fill out the application form in this channel. Our staff will review your submission soon.')
                .setTimestamp()
                .setFooter({ text: 'Zenta Roleplay', iconURL: interaction.guild.iconURL() });

            applicationChannel.send({ embeds: [applicationEmbed] });
            await interaction.reply({ content: 'Application system has been set up!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Error: Could not find the application channel.', ephemeral: true });
        }

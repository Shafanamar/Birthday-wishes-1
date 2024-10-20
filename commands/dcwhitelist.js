const { SlashCommandBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dcwhitelist')
        .setDescription('Removes a role and gives a whitelisted role on Discord'),
    
    async execute(interaction) {
        const roleBeforeWhitelist = interaction.guild.roles.cache.get(config.roleBeforeWhitelist);
        const roleWhitelisted = interaction.guild.roles.cache.get(config.roleWhitelisted);

        if (roleBeforeWhitelist && roleWhitelisted) {
            await interaction.member.roles.remove(roleBeforeWhitelist);
            await interaction.member.roles.add(roleWhitelisted);
            await interaction.reply({
                content: `You are now whitelisted on Discord! Put your IG name in <#${config.applicationChannelId}>.`,
                ephemeral: true
            });
        }
    }
};

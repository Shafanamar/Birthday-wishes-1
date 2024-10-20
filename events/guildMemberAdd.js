const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = (client, member) => {
    const welcomeChannel = member.guild.channels.cache.get(config.applicationChannelId);
    
    if (welcomeChannel) {
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle(`Welcome to Zenta Roleplay, ${member.user.username}!`)
            .setDescription('Please make sure to read the rules and apply for whitelisting.')
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: 'Zenta Roleplay Team', iconURL: member.guild.iconURL() });

        welcomeChannel.send({ embeds: [welcomeEmbed] });
    }
};

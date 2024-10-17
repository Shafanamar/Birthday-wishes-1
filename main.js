const { Client, GatewayIntentBits, Partials, EmbedBuilder, REST, Routes } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const TOKEN ='';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.GuildMember, Partials.Message]
});

// Advanced Welcome Message
client.on('guildMemberAdd', member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome');
    const welcomeMessage = `Welcome to the server, ${member}! We're glad to have you.`;
    
    if (welcomeChannel) welcomeChannel.send(welcomeMessage);
    
    // Send embed for more aesthetics
    const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`Welcome ${member.user.username}!`)
        .setDescription('We hope you have a great time here!')
        .setThumbnail(member.user.displayAvatarURL());
    
    welcomeChannel.send({ embeds: [embed] });
});

// Voice Channel Alert System
client.on('voiceStateUpdate', (oldState, newState) => {
    if (!oldState.channel && newState.channel) {
        const role = newState.guild.roles.cache.find(role => role.name === 'AlertRole'); // Replace 'AlertRole' with your role name
        const member = newState.member;
        const alertChannel = newState.guild.channels.cache.find(channel => channel.name === 'alerts');

        if (role) {
            alertChannel.send(`<@&${role.id}> Alert! ${member.user.username} has joined ${newState.channel.name}.`);
        }
    }
});

// /dcwhitelist Command Setup
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, options } = interaction;

    if (commandName === 'dcwhitelist') {
        const user = options.getUser('target');
        const role = interaction.guild.roles.cache.find(role => role.name === 'Whitelisted'); // Whitelisted role

        if (role) {
            if (interaction.options.getString('action') === 'add') {
                await interaction.guild.members.cache.get(user.id).roles.add(role);
                await interaction.reply({ content: `Added ${user.username} to whitelist!`, ephemeral: true });
            } else if (interaction.options.getString('action') === 'remove') {
                await interaction.guild.members.cache.get(user.id).roles.remove(role);
                await interaction.reply({ content: `Removed ${user.username} from whitelist!`, ephemeral: true });
            }
        }
    }
});

// Announcements with Embed
client.on('messageCreate', async message => {
    if (message.content.startsWith('!announce')) {
        const announcement = message.content.slice(9).trim();

        const embed = new EmbedBuilder()
            .setTitle('Announcement')
            .setDescription(announcement)
            .setColor(0x00FFFF)
            .setTimestamp();

        const announcementChannel = message.guild.channels.cache.find(channel => channel.name === 'announcements');
        if (announcementChannel) {
            announcementChannel.send({ embeds: [embed] });
        }
    }
});

// Bot Status
client.once('ready', () => {
    client.user.setPresence({
        activities: [{ name: 'Setting up...' }],
        status: 'online'
    });
    console.log(`${client.user.tag} is online and setting up!`);
});

// Registering Commands
const commands = [
    new SlashCommandBuilder()
        .setName('dcwhitelist')
        .setDescription('Add or remove user from whitelist.')
        .addUserOption(option => option.setName('target').setDescription('The user to whitelist').setRequired(true))
        .addStringOption(option => 
            option.setName('action')
            .setDescription('Choose to add or remove user')
            .setRequired(true)
            .addChoices({ name: 'Add', value: 'add' }, { name: 'Remove', value: 'remove' })
        )
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.login(TOKEN);

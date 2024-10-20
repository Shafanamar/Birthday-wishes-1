const config = require('../config.json');

module.exports = (client, oldState, newState) => {
    if (!oldState.channelId && newState.channelId === config.interviewVcId) {
        const interviewChannel = newState.guild.channels.cache.get(config.interviewTextChannelId);
        if (interviewChannel) {
            interviewChannel.send(`<@${newState.member.user.id}> has joined the interview room!`);
        }
    }
};

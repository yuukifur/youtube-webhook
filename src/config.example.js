module.exports = {
  // Tempo em minutos, tenha em mente que o limite do YouTube é de 1K de request por hora.
  TIMEOUT: 10,

  // https://www.youtube.com/feeds/videos.xml?user=
  // https://www.youtube.com/feeds/videos.xml?channel_id=
  RSS_FEED_URLS: [
    {
      url: 'https://www.youtube.com/feeds/videos.xml?user=ForeverPlayerGames',
      name: 'ForeverPlayer',
    },
    {
      url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCfSCj6pb_AMSszt73mqgP_Q',
      name: 'Lggj',
    },
  ],

  // https://discord.com/api/webhooks/id/token
  DISCORD_WEBHOOK_URL: '',
};

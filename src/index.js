const fs = require('fs');
const axios = require('axios');
const { parseString } = require('xml2js');
const { WebhookClient } = require('discord.js');

const {
  TIMEOUT,
  RSS_FEED_URLS,
  DISCORD_WEBHOOK_URL,
} = require('./config.example');

// gambiarra2000
// console.log = () => {};

const client = new WebhookClient({ url: DISCORD_WEBHOOK_URL });

async function getNewestVideo(feed) {
  console.log(`Buscando o vídeo mais recente de ${feed.name}...`);
  const response = await axios.get(feed.url);
  const xml = response.data;
  let newestVideo = null;

  parseString(xml, (err, result) => {
    if (err) throw err;
    const entry = result.feed.entry[0];
    newestVideo = {
      title: entry.title[0],
      url: entry.link[0].$.href,
      thumbnail: entry['media:group'][0]['media:thumbnail'][0].$.url,
      description: entry['media:group'][0]['media:description'][0],
      channelName: entry['author'][0]['name'][0],
      channelUrl: entry['author'][0]['uri'][0],
      publishedAt: new Date(entry.published[0]),
    };
  });

  console.log(`Vídeo mais recente de ${feed.name}:`, newestVideo.title);
  return { ...newestVideo, channelName: feed.name };
}

async function sendNotification(video) {
  console.log(`Enviando notificação para ${video.channelName}...`);
  await client.send({
    content: `Vídeo novo de **${video.channelName}**!`,
    embeds: [
      {
        title: video.title,
        url: video.url,
        image: {
          url: video.thumbnail,
        },
        author: {
          name: video.channelName,
          url: video.channelUrl,
        },
        description: shortenString(
          video.description.replace(/[\u{1F000}-\u{1F9FF}]/gu, '\\$&'),
          3,
        ),
        timestamp: video.publishedAt.toISOString(),
      },
    ],
  });
}

async function checkNewestVideo() {
  console.log('Verificando os vídeos mais recentes...');
  let lastVideos = {};

  try {
    lastVideos = JSON.parse(fs.readFileSync('lastVideos.json'));
  } catch (err) {
    if (err.code == 'ENOENT') {
      console.log('Arquivo lastVideos.json não encontrado, criando um novo.');
    } else {
      console.error('Erro ao carregar lastVideos:', err);
    }
  }

  for (const feed of RSS_FEED_URLS) {
    const newestVideo = await getNewestVideo(feed);

    // Verifica o último vídeo salvo para o feed atual
    const lastVideo = lastVideos[feed.url];

    console.log(`Vídeo mais recente salvo (${feed.name}):`, lastVideo?.title);

    if (!lastVideo || newestVideo.url !== lastVideo.url) {
      // Se o último vídeo for nulo ou o novo vídeo for diferente do último, envia uma notificação para o novo vídeo.
      console.log(`Novo vídeo encontrado (${feed.name})!`);
      await sendNotification(newestVideo);
      lastVideos[feed.url] = newestVideo;

      console.log(
        `Salvando o vídeo mais recente (${feed.name}):`,
        lastVideos[feed.url].title,
      );
    }
  }

  // Salva as informações de todos os feeds no mesmo arquivo
  try {
    fs.writeFileSync('lastVideos.json', JSON.stringify(lastVideos));
  } catch (err) {
    console.error('Erro ao salvar lastVideos:', err);
  }
}

function shortenString(str, numberOfLines) {
  const lines = str.split('\n');
  const firstThreeLines = lines.slice(0, numberOfLines).join('\n');
  return `${firstThreeLines}\n...`;
}

console.log('Iniciando o bot...');
checkNewestVideo();
setInterval(() => {
  checkNewestVideo();
}, TIMEOUT * 60 * 1000);

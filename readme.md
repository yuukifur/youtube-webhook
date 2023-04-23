# YouTube New Video Notifier

This script sends a Discord notification whenever a YouTube channel that you follow posts a new video.

## Prerequisites

- Node.js installed
- A Discord webhook URL
- One or more RSS feed URLs of the YouTube channels you want to track

## Setting up

1. Clone the repository: `git clone https://github.com/yuukifur/youtube-webhook.git`
2. Install dependencies: `npm install`
3. Rename `config.example.js` to `config.js`.
4. Set the `DISCORD_WEBHOOK_URL` variable to your Discord webhook URL in `config.js`.
5. Add the RSS feed URLs of the YouTube channels you want to track to the `RSS_FEED_URLS` array in `config.js`.
6. Run the script: `node index.js`

## Notes

- The script stores the information of the last video that was sent as a notification in the `lastVideos.json` file. Don't delete this file unless you want to reset the script's progress.
- The script includes several `console.log()` statements to log the script's progress and debugging information to the console.


![New video notification example](image.png)

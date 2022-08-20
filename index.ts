import "dotenv/config";

import { Bot } from "grammy";

const { TOKEN, WEBHOOK } = process.env;

if (!TOKEN) {
  console.log("Error: TOKEN variable not found");

  process.exit();
}

if (!WEBHOOK) {
  console.log("Error: WEBHOOK variable not found");

  process.exit();
}

const bot = new Bot(TOKEN);

bot.api.setWebhook(WEBHOOK);

import "dotenv/config";

import { bot } from "./src/bot";

const { WEBHOOK } = process.env;

if (!WEBHOOK) {
  console.log("Error: WEBHOOK variable not found");

  process.exit();
}

bot.api.setWebhook(WEBHOOK);

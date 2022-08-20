import "dotenv/config";

import { Bot, webhookCallback } from "grammy";

const { TOKEN } = process.env;

if (!TOKEN) {
  console.log("Error: TOKEN not found");

  process.exit();
}

const bot = new Bot(TOKEN);

// attach all middleware
bot.on("message", async (ctx) => {
  await ctx.reply("Hi there!");
});

// The free version of vercel has restrictions on quotas, which we need to enable in the configuration file vercel.json
// webhookCallback will make sure that the correct middleware(listener) function is called
export default webhookCallback(bot, "http");

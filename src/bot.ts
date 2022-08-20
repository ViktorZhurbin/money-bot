import "dotenv/config";

import { Bot } from "grammy";

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

bot.start();

export { bot };

import "dotenv/config";

import { Bot, session, webhookCallback } from "grammy";

import {
  handleSetAmount,
  handleAddTransaction,
  getCategoriesMenu,
  createInitialSessionData,
} from "../src/helpers";
import { MyContext, SessionData, Step } from "../src/types";

const { TOKEN } = process.env;

if (!TOKEN) {
  console.log("Error: TOKEN not found");

  process.exit();
}

const bot = new Bot<MyContext>(TOKEN);

bot.use(
  session({
    initial: createInitialSessionData,
  })
);

const categoryMenu = getCategoriesMenu();

bot.use(categoryMenu);
bot.on("message", async (ctx) => {
  const { text } = ctx.update.message;

  switch (ctx.session.step) {
    case Step.Initial:
      handleSetAmount(ctx);

    case Step.Category:
      await ctx.reply("Выбери категорию:", {
        reply_markup: categoryMenu,
      });

      break;

    case Step.Comment:
      console.log("step comment");
      if (text) {
        ctx.session.comment = text;

        handleAddTransaction(ctx);
      }
      ctx.session = createInitialSessionData();

    default:
      return;
  }
});

bot.command("no_comments", async (ctx) => {
  if (ctx.session.step !== Step.Comment) {
    return;
  }

  // handle spreadsheet update...
  handleAddTransaction(ctx);
});

bot.catch(console.error.bind(console));
bot.start();

// The free version of vercel has restrictions on quotas, which we need to enable in the configuration file vercel.json
// webhookCallback will make sure that the correct middleware(listener) function is called
export default webhookCallback(bot, "http");

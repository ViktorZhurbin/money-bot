import "dotenv/config";

import { Bot, session, webhookCallback } from "grammy";
import { Menu } from "@grammyjs/menu";

import { categoryDatabase } from "../src/constants";
import { MyContext, SessionData, Step } from "../src/types";

const { TOKEN } = process.env;

if (!TOKEN) {
  console.log("Error: TOKEN not found");

  process.exit();
}

const bot = new Bot<MyContext>(TOKEN);

bot.use(
  session({
    initial(): SessionData {
      return {
        amount: null,
        category: null,
        comment: "",
        step: Step.Initial,
      };
    },
  })
);

const categoriesMenu = new Menu<MyContext>("category");

bot.use(categoriesMenu);

for (const category of categoryDatabase) {
  categoriesMenu
    .text({ text: category, payload: category }, (ctx) => {
      if (ctx.session.step !== Step.Category) {
        return;
      }

      const category = ctx.match;

      if (typeof category !== "string") {
        throw new Error("No category");
      }

      ctx.session.category = category;
      ctx.session.step = Step.Comment;

      // console.log({ sessionWithCategory: ctx.session });

      ctx.reply("Комментарий? Или /no_comments ?");
    })
    .row();
}

const handleAddTransaction = (ctx: MyContext) => {
  // console.log({ sessionWithComment: ctx.session });

  ctx.session.step = Step.Initial;

  ctx.reply("Расход добавлен");
};

bot.command("no_comments", async (ctx) => {
  if (ctx.session.step !== Step.Comment) {
    return;
  }

  // handle spreadsheet update...
  handleAddTransaction(ctx);
});

// attach all middleware
bot.on("message", async (ctx) => {
  const { text } = ctx.update.message;

  switch (ctx.session.step) {
    case Step.Initial:
      const amount = Number.parseFloat(text ?? "");

      if (Number.isNaN(amount)) {
        await ctx.reply("В сумме должны быть только цифры");

        return;
      }

      ctx.session.amount = amount;

      // console.log({ sessionWithAmount: ctx.session });

      ctx.session.step = Step.Category;

    case Step.Category:
      await ctx.reply("Выбери категорию:", {
        reply_markup: categoriesMenu,
      });

      // console.log({ sessionWithMessage: ctx.session });
      break;

    case Step.Comment:
      if (text) {
        ctx.session.comment = text;

        handleAddTransaction(ctx);
      }

    default:
      return;
  }
});

// bot.catch(console.error.bind(console));
// bot.start();

// The free version of vercel has restrictions on quotas, which we need to enable in the configuration file vercel.json
// webhookCallback will make sure that the correct middleware(listener) function is called
export default webhookCallback(bot, "http");

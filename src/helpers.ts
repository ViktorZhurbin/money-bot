import { Menu } from "@grammyjs/menu";
import { categoryDatabase } from "./constants";
import { MyContext, SessionData, Step } from "./types";

export const createInitialSessionData = (): SessionData => ({
  amount: null,
  category: null,
  comment: "",
  step: Step.Initial,
});

export const getCategoriesMenu = () => {
  const categoriesMenu = new Menu<MyContext>("category");

  for (const category of categoryDatabase) {
    categoriesMenu
      .text({ text: category, payload: category }, (ctx) => {
        handleSelectCategory(ctx);
      })
      .row();
  }

  return categoriesMenu;
};

export const handleSetAmount = async (ctx: MyContext) => {
  console.log({ handleSetAmount1: ctx.session });
  const text = ctx.update.message?.text;
  const amount = Number.parseFloat(text ?? "");

  if (Number.isNaN(amount)) {
    await ctx.reply("В сумме должны быть только цифры");

    return;
  }

  ctx.session.amount = amount;
  ctx.session.step = Step.Category;
  console.log({ handleSetAmount2: ctx.session });
};

export const handleSelectCategory = async (ctx: MyContext) => {
  console.log({ handleSelectCategory1: ctx.session });
  if (ctx.session.step !== Step.Category) {
    return;
  }

  const category = ctx.match;

  if (typeof category !== "string") {
    throw new Error("No category");
  }

  ctx.session.category = category;
  ctx.session.step = Step.Comment;

  await ctx.reply("Комментарий? Или /no_comments ?");
  console.log({ handleSelectCategory2: ctx.session });
};

export const handleAddTransaction = async (ctx: MyContext) => {
  console.log({ handleAddTransaction1: ctx.session });
  const { amount, category, comment } = ctx.session;

  await ctx.reply(
    `Расход добавлен:
    Сумма: <b>${amount}</b>
    Категория: <b>${category}</b>
    Комментарий: <b>${comment}</b>`,
    { parse_mode: "HTML" }
  );

  ctx.session = createInitialSessionData();
  console.log({ handleAddTransaction2: ctx.session });
};

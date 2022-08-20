import { Context, SessionFlavor } from "grammy";

export enum Step {
  Initial = "initial",
  Category = "category",
  Comment = "comment",
}

export interface SessionData {
  amount: number | null;
  category: string | null;
  comment: string;
  step: Step;
}

export type MyContext = Context & SessionFlavor<SessionData>;

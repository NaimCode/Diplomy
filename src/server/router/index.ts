// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { authRouter } from "./auth";
import { formationRouter } from "./workspace/formation";
import { parametreRouter } from "./workspace/parametre";


export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.",authRouter)
  .merge("formation.",formationRouter)
  .merge('parametreRouter.',parametreRouter)

// export type definition of API
export type AppRouter = typeof appRouter;

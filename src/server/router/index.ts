// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { authRouter } from "./auth";
import { formationRouter } from "./workspace/formation";
import { parametreRouter } from "./workspace/parametre";
import { etudiantsRouter } from "./workspace/etudiants";
import { transactionRouter } from "./workspace/transaction";


export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.",authRouter)
  .merge("formation.",formationRouter)
  .merge('parametreRouter.',parametreRouter)
  .merge('etudiant.',etudiantsRouter)
  .merge('transaction.',transactionRouter)

// export type definition of API
export type AppRouter = typeof appRouter;

# Day 1 – TypeScript Setup and Type System

## Today's Focus
Set up a TypeScript project from scratch and understand the compiler, `tsconfig.json`, and the type system fundamentals.

## Tasks
- Initialise a Node.js project with `npm init -y`, then install TypeScript: `npm install --save-dev typescript`. Run `npx tsc --init` and open `tsconfig.json`. Enable `"strict": true` and set `"outDir": "dist"` and `"rootDir": "src"`.
- Write a `src/index.ts` file with variables of primitive types (`string`, `number`, `boolean`, `null`, `undefined`). Deliberately introduce a type error (assign a string to a number variable) and run `npx tsc --noEmit` to see the error. Fix it.
- Add `npm run build` and `npm run typecheck` scripts to `package.json`. Confirm `build` compiles to `dist/` and `typecheck` catches errors without emitting.
- Explore the difference between `any`, `unknown`, and `never`: write a function that uses `unknown` as a parameter type and requires a type guard (`typeof x === "string"`) before using it. Compare to using `any` and explain why `unknown` is safer.
- Define a union type (`type Status = "pending" | "active" | "archived"`) and an intersection type (`type AdminUser = User & { role: "admin" }`). Write a function for each that is fully type-safe.
- Convert a plain JavaScript file (any small utility you wrote in Week 1 or 2) to TypeScript by adding type annotations until `tsc --noEmit` passes with no errors.

## Reading / Reference
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — The Basics, Everyday Types, and Narrowing.
- [tsconfig.json reference](https://www.typescriptlang.org/tsconfig) — focus on `strict`, `target`, `module`, `outDir`, `rootDir`.
- [TypeScript Deep Dive by Basarat](https://basarat.gitbook.io/typescript/) — Chapters on Getting Started and Type System.

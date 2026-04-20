# Academy for Developers

An intensive 11-week course for developers covering the full stack from terminal basics to agentic AI.

The site is built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) and deploys to GitHub Pages on every push to `main`.

## Developing

Requires Node.js 20+ (CI uses 24).

```sh
npm install        # install dependencies

npm run dev        # serve locally with live reload at http://localhost:4321
npm run build      # build static output to dist/
npm run preview    # preview the production build
```

Course content lives in `src/content/docs/` (one folder per week), and the
sidebar is defined in `src/sidebar.json`. The site uses Starlight's default
light/dark theme.

## Course outline

| Week | Focus                                                    |
| ---- | -------------------------------------------------------- |
| 1    | Command Line, Environments and Git                       |
| 2    | Language Setup and Foundations                           |
| 3    | Web Development, APIs, and Browser-Server Interaction    |
| 4    | Databases                                                |
| 5    | Control Flow and Functions                               |
| 6    | Data Structures and Modelling                            |
| 7    | I/O, Network, and Data Processing                        |
| 8    | Containerization with Docker                             |
| 9    | Cloud Infrastructure Fundamentals                        |
| 10   | Agentic AI and Autonomous Systems                        |
| 11   | Capstone: Deliver a Containerised Project                |

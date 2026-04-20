# Day 2 – Node.js: Runtime, nvm, and npm

## Today's Focus

Understand what Node.js is and why it exists, install it using a version manager, and get comfortable with npm for managing JavaScript project dependencies.

## What is Node.js?

JavaScript was originally designed to run only inside a web browser — it had no access to the filesystem, network sockets, or operating system. **Node.js** is a JavaScript runtime built on Chrome's V8 engine that runs JavaScript outside the browser.

Node makes it possible to write servers, CLIs, scripts, and build tools in JavaScript — using the same language for both frontend and backend code. It ships with a built-in HTTP module, and the npm ecosystem gives it access to hundreds of thousands of packages.

Node is not a language — JavaScript is the language. Node is the environment that executes it outside a browser.

## Installing Node with nvm

Different projects require different Node versions. Installing Node directly risks the same global version conflict problem as Python. The solution is a version manager.

**nvm** (Node Version Manager) is the most widely used option. It installs Node versions into your home directory and lets you switch between them per-project.

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm --version
```

Install and use a specific version:

```sh
nvm install 20          # install Node 20 (LTS)
nvm use 20
node --version          # v20.x.x
npm --version
```

Set a default version for all new shell sessions:

```sh
nvm alias default 20
```

Pin a version per project using a `.nvmrc` file:

```sh
echo "20" > .nvmrc
nvm use                 # reads .nvmrc automatically
```

### n — a simpler alternative

**n** is a lighter version manager with a simpler interface. Install it once via npm, then use it to switch versions:

```sh
npm install -g n
n 20
node --version
```

nvm is generally preferred for teams because `.nvmrc` support makes version pinning automatic.

## npm and package.json

npm is Node's package manager — it downloads packages from the npm registry and tracks your project's dependencies in `package.json`.

### Starting a project

```sh
mkdir ~/projects/hello-node && cd ~/projects/hello-node
npm init -y
```

`npm init -y` creates a `package.json` with default values:

```json
{
  "name": "hello-node",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  }
}
```

### Installing packages

```sh
npm install express          # adds to dependencies
npm install --save-dev jest  # adds to devDependencies (not needed in production)
```

npm creates:

- `node_modules/` — the installed packages (never commit this)
- `package-lock.json` — the exact resolved versions (always commit this)

Add `node_modules/` to `.gitignore`:

```sh
echo "node_modules/" >> .gitignore
```

### Key npm commands

| Command | Description |
| ------- | ----------- |
| `npm install` | Install all dependencies listed in `package.json` |
| `npm install <pkg>` | Add a new dependency |
| `npm run <script>` | Run a script defined in `package.json` |
| `npm start` | Shortcut for `npm run start` |
| `npm list` | Show installed packages |
| `npm outdated` | Show packages with newer versions available |

## Writing and Running JavaScript with Node

Create `index.js`:

```js
const name = 'Academy'
const languages = ['Python', 'JavaScript', 'Go', 'C#']

console.log(`Hello from ${name}!`)
console.log(`This course covers: ${languages.join(', ')}`)

languages.forEach((lang, i) => {
  console.log(`  ${i + 1}. ${lang}`)
})
```

Run it:

```sh
node index.js
# or
npm start
```

## Tasks

- Install nvm following the instructions above. Close and reopen your terminal (or `source ~/.zshrc`), then verify `nvm --version`.
- Install Node 20 with `nvm install 20`. Check `node --version` and `npm --version`.
- Create a `~/projects/hello-node` project with `npm init -y`. Install `express` as a dependency and inspect `package.json` and `package-lock.json` — note what each records.
- Add a `node_modules/` entry to `.gitignore`. Delete `node_modules/`, run `npm install`, and confirm the packages come back — this is how a colleague restores your project after cloning it.
- Create a `.nvmrc` file pinning Node 20 in your project. Run `nvm use` and confirm it reads the file.
- Write a `index.js` script that defines a function, calls it with different arguments, and logs the results. Run it with `node index.js`.

## Reading / Reference

- [nvm README](https://github.com/nvm-sh/nvm)
- [npm documentation](https://docs.npmjs.com/)
- [Node.js about page](https://nodejs.org/en/about)
- [The Odin Project: Introduction to Node](https://www.theodinproject.com/lessons/nodejs-introduction-to-node)

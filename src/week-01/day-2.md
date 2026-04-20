# Day 2 – The PATH and Making Your Own Commands

## Today's Focus

Understand what happens when you type a command, how the shell finds it, and how to create your own commands that work from anywhere on the system.

## What is PATH?

When you type a command like `ls` or `git`, the shell doesn't search your entire filesystem — it only looks in a specific list of directories called the **PATH**. The PATH is an environment variable containing a colon-separated list of directories:

```sh
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

The shell searches these directories **from left to right** and runs the first match it finds. If no match is found, you see `command not found`.

Run this to see your current PATH:

```sh
echo $PATH
```

Run this to see exactly which version of a command the shell will use:

```sh
which git
which python3
which ls
```

## Key Concepts

| Concept | Explanation |
| ------- | ----------- |
| `$PATH` | Environment variable listing directories the shell searches for commands. |
| Left-to-right order | The shell uses the first match found — earlier directories take priority. |
| `which <cmd>` | Shows the full path of the executable that would run for a given command. |
| `export` | Makes an environment variable available to the current shell session and any child processes. |
| `~/.zshrc` / `~/.bashrc` | Shell configuration files that run every time a new interactive shell session starts. |
| `~/.zprofile` / `~/.profile` | Login shell configuration files that run once at login — used for PATH changes that should apply system-wide. |
| `source` | Reload a config file in the current session without opening a new terminal: `source ~/.zshrc`. |

## Tasks

- Print your PATH and identify each directory in it. Run `ls` on two or three of those directories to see what commands live there.
- Use `which` to locate `ls`, `git`, `python3`, and `echo`. Open one of those directories in your terminal and confirm the binary is there.
- Understand order: create two scripts with the same name in two different directories, put both on your PATH in different positions, and observe which one runs. Then swap the order and see the result change.
- Create a personal bin directory and add a custom command to it:

  ```sh
  mkdir -p ~/bin
  ```

  Create a script `~/bin/hello` with the following content:

  ```sh
  #!/bin/sh
  echo "Hello from my own command!"
  ```

  Make it executable:

  ```sh
  chmod +x ~/bin/hello
  ```

- Try running `hello` — it will fail with `command not found` because `~/bin` is not on your PATH yet.
- Add `~/bin` to your PATH **for the current session only** (disappears when the terminal closes):

  ```sh
  export PATH="$HOME/bin:$PATH"
  ```

  Run `hello` again — it should work now. Run `which hello` to confirm the shell found it in `~/bin`.

- Make the change **permanent** by adding the export to your rc file. Open `~/.zshrc` (or `~/.bashrc` if you use bash) and add the line at the bottom:

  ```sh
  export PATH="$HOME/bin:$PATH"
  ```

  Reload the file without closing the terminal:

  ```sh
  source ~/.zshrc
  ```

  Open a new terminal tab and confirm `hello` still works.

- Explore the difference between `~/.zshrc` (runs for every interactive shell) and `~/.zprofile` (runs once at login). For PATH changes, `~/.zprofile` is the more appropriate place on macOS — move your export there and test it by logging out and back in, or by running `zsh --login -c 'echo $PATH'`.

## Reading / Reference

- `man zshrc` / `man bash` — search for the "STARTUP FILES" section to understand the order rc files are loaded.
- `echo $SHELL` — tells you which shell you are running so you know which rc file to edit.
- [The Linux Command Line (William Shotts)](https://linuxcommand.org/tlcl.php) — Chapter 11 covers the environment and startup files.

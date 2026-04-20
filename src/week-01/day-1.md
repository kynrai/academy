# Day 1 – Terminal Navigation and Core Commands

## Today's Focus

Learn to navigate the filesystem and manipulate files entirely from the terminal using a core set of commands, then write and run your first shell script.

## Commands

| Command | Description |
| ------- | ----------- |
| `pwd` | Print the current working directory (your location in the filesystem). |
| `ls` | List the contents of a directory. Use `-l` for details and `-a` to show hidden files. |
| `cd` | Change directory. `cd ~` goes home, `cd ..` goes up one level, `cd -` returns to the previous location. |
| `mkdir` | Create a directory. Use `-p` to create nested directories in one command. |
| `touch` | Create an empty file, or update the timestamp of an existing one. |
| `echo` | Print text to the terminal. Use `>` to write to a file and `>>` to append. |
| `cat` | Print the contents of a file to the terminal. |
| `cp` | Copy a file or directory. Use `-r` to copy a directory and its contents. |
| `mv` | Move or rename a file or directory. |
| `rm` | Delete a file. There is no undo — deleted files do not go to a trash folder. |
| `rmdir` | Remove an empty directory. Safer than `rm -rf` because it refuses to delete a directory that still has contents. |
| `rm -rf` | Forcefully and recursively delete a directory and everything inside it. **Use with extreme caution** — it will permanently destroy files with no confirmation prompt and no recovery. Never run it as root or against `/`. |
| `chmod` | Change file permissions. `chmod +x` makes a file executable. |

## Tasks

- Open your terminal. Run `pwd` to see where you are, then `ls` to list the contents. Run `ls -l` and `ls -la` and note what the extra flags reveal.
- Use `cd` to move around: `cd ~` to go home, `cd ..` to go up one level, `cd -` to return to the previous directory. Run `pwd` after each move to confirm where you are.
- Create a deep directory structure in one command: `mkdir -p ~/academy/week-01/project/src/utils`. Navigate into it using `cd` and back out again.
- Use `touch` to create several files: `touch README.md main.sh config.txt`. Verify they exist with `ls -l`.
- Use `echo` to write content into a file: `echo "Hello, World!" > hello.txt`. Read it back with `cat hello.txt`.
- Use `echo` to append a second line without overwriting: `echo "Goodbye, World!" >> hello.txt`. Confirm both lines are there with `cat`.
- Copy a file with `cp hello.txt hello-copy.txt`. Rename it with `mv hello-copy.txt hello-backup.txt`. Delete it with `rm hello-backup.txt`.
- Create a script file called `hello.sh` containing the following:

  ```sh
  #!/bin/sh
  echo "Hello, World!"
  ```

  Try running it with `sh hello.sh`. Then make it directly executable: `chmod +x hello.sh` and run it with `./hello.sh`. Observe the difference.
- Tidy up: delete individual files with `rm`, then remove an empty directory with `rmdir`. Notice that `rmdir` refuses if the directory still has contents — this is a useful safety feature. Compare this with `rm -rf`, which deletes everything silently and immediately with no way to recover.

## Reading / Reference

- [The Linux Command Line (William Shotts)](https://linuxcommand.org/tlcl.php) — Chapters 1–4 (free online).
- `man ls`, `man mkdir`, `man chmod` — skim the synopsis and common options.
- `tldr cd`, `tldr chmod` — quick practical examples if you have `tldr` installed.

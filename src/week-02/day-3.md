# Day 3 – .NET and C#: SDK, CLI, and Basics

## Today's Focus

Install the .NET SDK, understand the relationship between .NET and C#, use the `dotnet` CLI to create and run projects, and write basic C# code.

## What is .NET?

**.NET** is a free, cross-platform runtime and SDK from Microsoft. It is the environment that executes compiled C# code — similar to how the JVM runs Java or Node runs JavaScript.

**C#** is the language. .NET is the platform that runs it.

.NET can build: web APIs, web apps, desktop apps, mobile apps (via MAUI), CLIs, and background services. In this course it is used for building web APIs with ASP.NET Core.

Key terms:

| Term | Explanation |
| ---- | ----------- |
| .NET SDK | The software development kit — includes the compiler, runtime, and `dotnet` CLI. Install this for development. |
| .NET Runtime | The runtime only — enough to run apps, not build them. Used in production containers. |
| ASP.NET Core | The web framework included in .NET for building HTTP servers and APIs. |
| NuGet | The .NET package registry, equivalent to PyPI or npm. |
| `dotnet` CLI | The command-line tool for creating, building, running, and publishing .NET projects. |

## Installing the .NET SDK

**macOS (Homebrew):**

```sh
brew install --cask dotnet-sdk
dotnet --version
```

**Linux (apt):**

```sh
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update && sudo apt install dotnet-sdk-8.0
dotnet --version
```

Verify the install:

```sh
dotnet --list-sdks      # all installed SDKs
dotnet --list-runtimes  # all installed runtimes
```

### Managing .NET versions

Multiple SDK versions can coexist on one machine. Pin the version for a project using a `global.json` file:

```sh
dotnet new globaljson --sdk-version 8.0.0
cat global.json
```

## The dotnet CLI

The `dotnet` CLI handles the full project lifecycle:

| Command | Description |
| ------- | ----------- |
| `dotnet new <template>` | Create a new project from a template. |
| `dotnet run` | Build and run the current project. |
| `dotnet build` | Compile without running. |
| `dotnet test` | Run tests. |
| `dotnet add package <name>` | Add a NuGet package. |
| `dotnet restore` | Restore dependencies listed in the project file. |
| `dotnet publish` | Produce a deployable build output. |

List available project templates:

```sh
dotnet new list
```

## Creating and Running a Console App

```sh
mkdir ~/projects/hello-dotnet && cd ~/projects/hello-dotnet
dotnet new console
```

This creates:

- `hello-dotnet.csproj` — the project file (dependencies, target framework, build settings)
- `Program.cs` — the entry point

The generated `Program.cs` uses top-level statements (no explicit `Main` method needed in modern C#):

```csharp
Console.WriteLine("Hello, World!");
```

Run it:

```sh
dotnet run
```

## C# Basics

Edit `Program.cs` to explore the language:

```csharp
// Variables and types
string name = "Academy";
int year = 2024;
bool isOpen = true;

// String interpolation
Console.WriteLine($"Hello from {name}!");

// Collections
var languages = new List<string> { "Python", "JavaScript", "Go", "C#" };

// Loop
foreach (var lang in languages)
{
    Console.WriteLine($"  - {lang}");
}

// Function (method outside a class, using top-level statements)
static string Greet(string language)
{
    return $"Hello from {language}";
}

Console.WriteLine(Greet("C#"));
```

Run it:

```sh
dotnet run
```

### Project file

The `.csproj` file controls the project. Adding a NuGet package updates it automatically:

```sh
dotnet add package Newtonsoft.Json
```

This adds an entry to the `.csproj` and creates a lock file (`packages.lock.json` if enabled). Dependencies are stored in a global NuGet cache, not in a local `node_modules`-style folder — so there is nothing to gitignore for packages.

## Tasks

- Install the .NET SDK and verify with `dotnet --version` and `dotnet --list-sdks`.
- Create a console project with `dotnet new console`. Read the generated `Program.cs` and `.csproj` files.
- Edit `Program.cs` to print a list of items using `foreach`, use string interpolation, and call a method you define. Run it with `dotnet run`.
- Add the `Newtonsoft.Json` NuGet package with `dotnet add package`. Write code that serialises a C# object to a JSON string and prints it. Run it.
- Run `dotnet build` and inspect the `bin/` output directory. Note that `dotnet run` combines build and run.

## Reading / Reference

- [.NET documentation](https://learn.microsoft.com/en-us/dotnet/)
- [C# language tour](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/)
- [dotnet CLI reference](https://learn.microsoft.com/en-us/dotnet/core/tools/)
- [NuGet gallery](https://www.nuget.org/)

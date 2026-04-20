# Day 1 – Tool-Using Agent Basics

## Today's Focus
Understand what makes a system "agentic" and build your first tool-using agent that calls an external API.

## Tasks
- Read the Anthropic documentation on [tool use](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) (function calling). Understand the request/response cycle: you define tools in the API call, Claude returns a `tool_use` block, you execute the tool and return a `tool_result`, and Claude produces a final response.
- Set up your project: create a Python or TypeScript project, install the Anthropic SDK, and store your API key in `.env` as `ANTHROPIC_API_KEY`. Never commit the key.
- Define a tool called `get_weather` with parameters `city: string` and `units: "celsius" | "fahrenheit"`. Wire it to a real weather API (e.g. [Open-Meteo](https://open-meteo.com/) — free, no key required). When Claude calls the tool, execute the API request and return the result.
- Write the agent loop: send a user message like "What is the weather in London and Paris, and which is warmer?", handle the `tool_use` response by calling your function, send the `tool_result` back, and print Claude's final natural language answer.
- Add logging to every step: log the user message, Claude's response (including tool calls), the tool result you sent, and the final answer. This is essential for debugging agentic systems.
- Test with an ambiguous request: "Is it a good day to cycle outside?" — the agent must decide which city to query (ask the user or make an assumption), call the tool, and reason about the answer. Observe how it handles under-specified input.

## Reading / Reference
- [Anthropic: Tool use documentation](https://docs.anthropic.com/en/docs/build-with-claude/tool-use).
- [Anthropic: Build effective agents](https://www.anthropic.com/research/building-effective-agents).
- [Open-Meteo API docs](https://open-meteo.com/en/docs) — free weather API, no authentication needed.

# Weekend Challenges

## Extended Challenges
- **Persistent agent state**: Refactor your agent to use a SQLite database (via `sqlite3` or `sqlmodel`) to persist conversation history, tool call logs, and memory across sessions. Restart the agent and verify it remembers context from a previous session. Design the schema so you can replay any session.
- **Streaming responses**: Implement streaming using the Anthropic SDK's `stream()` method. Print Claude's response token by token to the terminal as it arrives. Add a spinner/progress indicator for tool execution phases. Notice how streaming changes the user experience for long responses.
- **Agent red-teaming**: Try to break your own agent with adversarial inputs: (1) prompt injection via tool results (return malicious instructions from your mock `fetch_url`), (2) context overflow (send a very long message), (3) tool call flooding (craft a prompt that makes the agent call the same tool 50 times). Document what broke and how you would fix it.
- **MCP (Model Context Protocol)**: Explore Anthropic's [Model Context Protocol](https://modelcontextprotocol.io/). Set up a local MCP server that exposes one of your tools. Connect to it from a Claude Desktop or SDK client. Understand why a standardised tool protocol matters for ecosystem composability.
- **Agentic benchmark**: Run your research agent against a small subset of [HotpotQA](https://hotpotqa.github.io/) multi-hop reasoning questions. Score accuracy, measure tokens used per question, and estimate cost per 1,000 questions. What is the cost/accuracy trade-off of using Claude Haiku vs Sonnet for the worker agent?

## Recommended Reading
- [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents) — the canonical guide from Anthropic's own researchers.
- [ReAct: Synergizing Reasoning and Acting in Language Models (paper)](https://arxiv.org/abs/2210.03629) — the foundational research behind tool-using agents.
- [LLM Powered Autonomous Agents (Lilian Weng's blog)](https://lilianweng.github.io/posts/2023-06-23-agent/) — comprehensive overview of memory, planning, and tool use.
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — the full list with mitigations.

## Reflection
- Your agent has access to tools that can fetch URLs and query APIs. What is the worst thing that could happen if an attacker controlled the content of a page your agent fetched? How does this prompt injection scenario differ from a traditional web injection attack?
- You implemented a `max_iterations` safety limit. What other limits should a production agentic system have? Think about: time, cost, memory, scope of actions.
- How does the reliability of your agent change as the number of sequential tool calls increases? What compound failure rate do you get if each tool call has a 5% failure chance and you need 10 successful calls in sequence?
- You evaluated your agent with an LLM-as-judge. What are the weaknesses of this evaluation approach? When might the judge LLM and the agent LLM agree on a wrong answer?
- In a multi-agent system with an orchestrator and workers, where is the single point of failure? How would you design for resilience if the orchestrator crashes mid-task?

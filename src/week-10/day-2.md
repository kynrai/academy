# Day 2 – Multi-Step Reasoning Pipeline

## Today's Focus
Build a multi-step reasoning pipeline with error recovery: the agent must plan, execute, observe results, and retry on failure.

## Tasks
- Design a research agent: given a topic, the agent should (1) search for relevant information using a `web_search` tool (mock it with a static JSON response if you do not have a live search API), (2) fetch the content of the top result using a `fetch_url` tool, (3) summarise the content, and (4) return a structured answer.
- Implement the agent loop properly: continue calling the API with accumulated `messages` until Claude returns a `stop_reason` of `"end_turn"` (not `"tool_use"`). Use a `max_iterations` counter (e.g. 10) and raise an exception if it is exceeded — this prevents infinite loops.
- Add error recovery: if your `fetch_url` tool returns an error (404, timeout, etc.), return an error `tool_result` and let Claude decide to try a different URL or acknowledge the failure. Log when this happens.
- Implement structured output: after the research, prompt Claude to return a JSON object with a fixed schema (`{"summary": str, "key_facts": list[str], "confidence": float}`). Use `json.loads()` to parse and validate it. If parsing fails, retry the final step with an explicit instruction to return valid JSON.
- Test error recovery: deliberately break your `fetch_url` tool to return an error for the first call. Confirm Claude falls back to the search results text directly rather than crashing the pipeline.

## Reading / Reference
- [Anthropic: Building effective agents](https://www.anthropic.com/research/building-effective-agents) — the "augmented LLM", "prompt chaining", and "routing" patterns.
- Anthropic docs: [Messages API reference](https://docs.anthropic.com/en/api/messages) — `stop_reason` values and message structure.
- [LangChain: ReAct agent pattern](https://python.langchain.com/docs/modules/agents/) — even if you are not using LangChain, understanding ReAct (Reason + Act) is foundational.

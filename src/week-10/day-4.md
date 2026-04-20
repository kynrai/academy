# Day 4 – Observability and Safety Guardrails

## Today's Focus
Add observability to your agent, evaluate output quality, and apply safety guardrails.

## Tasks
- Add structured logging throughout your agent pipeline using Python's `structlog` or Node's `pino`: every LLM call should log `model`, `input_tokens`, `output_tokens`, `latency_ms`, `stop_reason`, and the number of tool calls. Visualise one run's token usage in a summary at the end.
- Implement cost tracking: using Anthropic's published token prices for Claude Sonnet, calculate and log the estimated USD cost of each API call. Add a `max_cost_usd` parameter to your agent — raise a `BudgetExceededError` if the cumulative cost exceeds the limit.
- Write an evaluation harness: create 10 test cases (`{"input": str, "expected_output": str, "eval_type": "exact"|"contains"|"llm_judge"}`). For `llm_judge` cases, use a second LLM call to assess whether the agent output correctly answers the question. Report a pass rate at the end.
- Add a safety guardrail: before executing any tool call, check if the requested action is on an allowlist. If Claude tries to call a tool that is not defined or attempts to call `eval()` or `os.system()` via code generation, log the attempt, refuse the tool execution, and return an error `tool_result`.
- Implement human-in-the-loop for high-impact actions: add a `send_email` tool that prints a confirmation prompt and waits for the user to type `yes` before sending. Test that the agent correctly waits for approval.

## Reading / Reference
- [Anthropic: Reducing hallucinations](https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations).
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — especially prompt injection and insecure tool execution.
- [Anthropic: Model pricing](https://www.anthropic.com/pricing) — for cost calculations.

# Day 3 – Agent Memory and RAG

## Today's Focus
Add memory to your agent: implement in-context summarisation, external key-value storage, and vector-based retrieval.

## Tasks
- Implement in-context memory: maintain a running `conversation_history` list of messages. After every 10 turns, use Claude to summarise the history into a compact system message, replace the old messages with the summary, and continue. This keeps the context window from filling up.
- Add a key-value memory store using a simple JSON file or Redis: when the user mentions a preference (e.g. "I prefer temperatures in Celsius"), store `{"unit_preference": "celsius"}` keyed by a session ID. Retrieve and inject this into the system prompt at the start of each conversation.
- Set up a vector store (use [Chroma](https://www.trychroma.com/) — runs locally, no API key): embed a set of 20 documents (e.g. news articles or FAQ entries) using the `sentence-transformers` library or the Anthropic embedding API. Store the embeddings in Chroma.
- Implement retrieval-augmented generation (RAG): when the user asks a question, embed the query, retrieve the top 3 most similar documents from Chroma, inject them into the system prompt as context, and ask Claude to answer based only on the provided documents.
- Compare quality: ask the same question with and without RAG context. Note the difference in accuracy. Then ask a question whose answer is NOT in your document set — observe how the agent handles it when instructed to say "I don't know" if the context is insufficient.

## Reading / Reference
- [Chroma documentation: Getting Started](https://docs.trychroma.com/getting-started).
- [Sentence Transformers documentation](https://www.sbert.net/docs/quickstart.html).
- [Anthropic: Contextual retrieval](https://www.anthropic.com/news/contextual-retrieval) — a technique for improving RAG accuracy.

# AI Multi-Agent Technical Article Writer

A production-ready AI pipeline built with **Node.js** and **Google AI** that generates technical articles through a sequence of specialized AI agents.

Instead of asking a single AI prompt to write an entire article, the writing process is divided into multiple stages. Each agent focuses on one specific responsibility, making the generated content more structured, easier to maintain, and simpler to improve over time.

---

## Agent Overview

| Agent        | What it does                                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Planner**  | Understands the topic and creates a strategy for the article by defining the audience, writing style, learning goals, and overall direction. |
| **Research** | Collects technical knowledge, best practices, implementation details, trade-offs, and other important concepts needed before writing begins. |
| **Outline**  | Organizes the research into a clear article structure with logical sections, objectives, summaries, and suggested code examples.             |
| **Writer**   | Uses the strategy, research, and outline to generate the first complete Markdown version of the article.                                     |
| **Reviewer** | Reviews the draft to improve grammar, readability, flow, consistency, and technical clarity while preserving the original meaning.           |
| **SEO**      | Generates SEO-friendly metadata including the title, meta description, URL slug, keywords, and tags.                                         |
| **Exporter** | Saves the final article and SEO metadata to the local `output` directory for publishing or further editing.                                  |

---

## Project Structure

```text
.
├── agents/
├── prompts/
├── services/
├── config/
├── utils/
├── articles/
├── index.js
└── package.json
```

---

## Features

- Multi-Agent Architecture
- Functional Pipeline
- Immutable State Management
- Modular Prompt Design
- Markdown Article Generation
- SEO Metadata Generation
- Local File Export

---

## Tech Stack

- Node.js
- JavaScript (ES Modules)
- Google AI
- dotenv
- Zod

---

## Getting Started

```bash
npm install
npm start
```

Running the application executes the complete pipeline, generating a production-ready technical article along with its SEO metadata inside the `output` directory.

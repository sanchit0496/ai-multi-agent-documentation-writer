# AI Multi-Agent Technical Article Writer

A Node.js project that uses **Google AI** to generate technical articles through a multi-agent workflow. Instead of asking one model to write an entire article, the work is divided into specialized agents. Each agent focuses on a single responsibility, making the output easier to review, improve, and maintain.

---

## Workflow

```mermaid
flowchart TD

    A[Topic]
    --> B[Planner Agent]
    --> C[Research Agent]
    --> D[Outline Agent]
    --> E[Writer Agent]
    --> F[Reviewer Agent]
    --> G[Metrics Service]
    --> H[Supervisor Service]

    H -->|Approved| I[SEO Agent]
    I --> J[Exporter Agent]
    J --> K[End]

    H -->|Needs Revision| L[Apply Reviewer Feedback]
    L --> E
```


---

## Components

| Component          | Responsibility                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Planner            | Creates the article strategy based on the given topic.                                                   |
| Research           | Collects technical concepts, best practices, and implementation details.                                 |
| Outline            | Organizes the research into a structured article outline.                                                |
| Writer             | Generates the article or improves an existing draft using reviewer feedback.                             |
| Reviewer           | Reviews the article, assigns quality scores, and provides improvement suggestions.                       |
| Metrics Service    | Calculates objective metrics like readability, SEO, formatting, and word count.                          |
| Supervisor Service | Combines the review scores and metrics to decide whether the article is ready or needs another revision. |
| SEO                | Generates SEO metadata for the final article.                                                            |
| Exporter           | Saves the article and SEO metadata to the `output` directory.                                            |

---

## Example

For a topic like **"React JS Performance Optimization"**, the Writer generates the first draft, the Reviewer evaluates it and suggests improvements, the Metrics Service calculates objective scores, and the Supervisor decides whether the article is good enough to continue or should go back to the Writer for another revision. This loop continues until the quality threshold is met or the maximum revision limit is reached.


<img width="1280" height="647" alt="WhatsApp Image 2026-06-29 at 10 53 51" src="https://github.com/user-attachments/assets/4d378983-a1ad-4692-973b-ac6622151ec3" />


---

## Features

* Multi-Agent Architecture
* Automated Review Loop
* AI + Rule-Based Evaluation
* Markdown Article Generation
* SEO Metadata Generation
* Local File Export

---

## Tech Stack

* Node.js
* JavaScript (ES Modules)
* Google AI

---

## Run

```bash
npm install
npm start
```

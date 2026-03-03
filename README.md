# LLM Council (Enhanced with Semantic Similarity)



Instead of asking a single LLM for answers, this project lets you create your own **LLM Council**.

Multiple large language models are queried in parallel, asked to evaluate each other anonymously, and then a designated Chairman model synthesizes a final response.

This version extends the original idea by integrating **semantic similarity analysis** using sentence embeddings and cosine similarity. The result is a more transparent, measurable, and insightful multi-model system.

---

# Overview

When a user submits a query, the system runs through three stages:

---

## Stage 1 — First Opinions

Each council model receives the query independently.

- Responses are displayed in a tab view.
- Each response is compared semantically to the original query.
- Cosine similarity is used to measure relevance.
- The most relevant response is highlighted with:
  - A star badge
  - “Most Relevant to Query” label

This immediately shows which model understood the query most closely.

---

## Stage 2 — Peer Review + Semantic Analysis

Each model anonymously evaluates and ranks the other responses.

In addition, the backend computes:

### Semantic Relevance Scores
- Cosine similarity between each response and the query.
- Displayed as a relevance bar chart.

### Similarity Heatmap
- Pairwise cosine similarity between all responses.
- Reveals redundancy vs uniqueness.
- Highlights model agreement and disagreement.

### Aggregate Rankings
- Average ranking position across peer evaluations.

This stage combines:
- LLM peer judgment
- Mathematical semantic scoring
- Cross-model consensus

---

## Stage 3 — Chairman Synthesis

The Chairman LLM synthesizes the final answer using:

- All Stage 1 responses
- Peer rankings
- Semantic similarity signals

An insight banner summarizes:

- Most relevant response and its score
- Average relevance across responses
- Response diversity level (High / Moderate / Low)
- Explanation of how semantic similarity influenced the final synthesis

This makes the reasoning process transparent and measurable.

---

# Semantic Similarity Engine

A new module introduces quantitative semantic evaluation.

### What It Does

- Generates sentence embeddings using a transformer model
- Computes cosine similarity:
  - Query ↔ Response (relevance)
  - Response ↔ Response (diversity)
- Produces:
  - Relevance scores
  - Similarity matrix
  - Diversity metrics

### Why It Matters

The original council relied only on LLM reasoning.  
This version blends:

- Model-based evaluation  
- Mathematical semantic similarity  
- Diversity detection  

The system becomes more explainable and less redundant.

---

# Backend Structure

### `config.py`
- Council model configuration
- Chairman model configuration
- Semantic model identifier
- Uses `OPENROUTER_API_KEY`
- Runs on port 8001

### `openrouter.py`
- Async model querying
- Parallel execution with graceful degradation

### `council.py`
- Stage 1 response collection
- Stage 2 anonymized peer ranking
- Stage 3 final synthesis
- Aggregate ranking computation
- Integration of semantic similarity scoring

### `semantic_similarity.py`
- Embedding generation
- Cosine similarity calculation
- Batch similarity matrix computation

### `storage.py`
- JSON-based conversation persistence

### `main.py`
- FastAPI application
- Streams stage updates
- Returns semantic similarity metadata

---

# Frontend Enhancements

### Stage 1
- Star badge for most relevant response
- Golden highlight styling

### Stage 2
- Relevance bar chart
- Similarity heatmap

### Stage 3
- Gradient insight banner
- Diversity indicators
- Semantic transparency explanation

---

# Setup

## 1. Install Dependencies

Backend:

```bash
uv sync
```
Frontend:
```bash
cd frontend
npm install
cd ..
```
## 2. Configure API Key

Create a .env file:
```bash
OPENROUTER_API_KEY=sk-or-v1-...
```
Get your API key from openrouter.ai.

## 3. Configure Council Models (Optional)


Edit:
```bash
backend/config.py
```
Example:
```bash
COUNCIL_MODELS = [
    "openai/gpt-5.1",
    "google/gemini-3-pro-preview",
    "anthropic/claude-sonnet-4.5",
    "x-ai/grok-4",
]

CHAIRMAN_MODEL = "google/gemini-3-pro-preview"
```

## Running the Application

**Option 1:**
```bash
./start.sh
```
**Option 2:**

Backend:
```bash
uv run python -m backend.main
```
Frontend:
```bash
cd frontend
npm run dev
```


**Open:**
```bash
http://localhost:5173
```
**Backend runs on:**
```bash
http://localhost:8001
```

# Tech Stack

## Backend
- FastAPI  
- OpenRouter API  
- Sentence-Transformers  
- NumPy  
- Cosine Similarity  

## Frontend
- React + Vite  
- Data visualizations  
- Markdown rendering  

## Storage
- JSON-based conversations  


---

# Acknowledgement

This project builds upon the original LLM Council concept created by [Andrej Karpathy](https://github.com/karpathy/llm-council).  The base idea and inspiration come from his public repository and experiments with evaluating multiple LLMs side by side.

This version extends the original work by integrating semantic similarity, cosine similarity analysis, and visualization features to enhance transparency, diversity measurement, and response relevance evaluation.

The original spirit of rapid experimentation and exploration has been preserved while adding structured semantic analysis to make the system more explainable and measurable.
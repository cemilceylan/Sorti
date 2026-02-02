# GEMINI.md - Project Context

## 📂 Project Overview
**Project Name:** Sorti (Deep Learning / Trash Classification)
**Goal:** Build a Convolutional Neural Network (CNN) to classify images of trash into categories (e.g., cardboard, glass, metal). The final output is a "Beleg" (project paper/assignment) and a defense presentation.
**Context:** This project is part of the "ProgData WS25" course (Intro to Deep Learning using Computer Vision).

## 🛠 Tech Stack (Planned)
*   **Language:** Python
*   **Environment:** Jupyter Notebooks (`.ipynb`)
*   **Deep Learning Framework:** TensorFlow / Keras
*   **Data Manipulation/Viz:** NumPy, Matplotlib

## 📁 Directory Structure
*   **`data/`**: The core dataset.
    *   `training/`: Categorized subdirectories (e.g., `battery`, `biological`, `cardboard`, `glass`, `metal`, `paper`, `plastic`, `shoes`).
    *   `test/`: Uncategorized or flat list of images (e.g., `trash_1.jpg`) for testing/prediction.
*   **`roadmap.md`**: The central project guide. It defines milestones, the "Mentor" persona for AI agents, and the step-by-step learning path.
*   **`ProgData Notes....csv`**: Course schedule and lecture notes.

## 🚀 Usage & Workflow
This project follows a streamlined **3-Run Strategy** (Act 1: Baseline, Act 2: Regularization, Act 3: Champion) as defined in `approach.md`.

**Current Status:**
1.  **3-Run Strategy:** Run 1 (Baseline) analyzed; Run 2 & 3 in redo phase for consistent results.
2.  **Documentation:** `beleg.md` (Draft complete), `results/results.md` (Detailed lab log started).
3.  **Final Goal:** Achieve >85% accuracy and complete the 5-page "Beleg" and 20-minute defense presentation.

### Key Commands (Anticipated)
*   **Execution:** Training loops in `sorti.ipynb`.
*   **Results:** Artifacts and metrics are stored in `results/`.
*   **Analysis:** Diagnostics (Confusion Matrix) generated for the Champion model.

## 📝 Conventions & Agent Persona
*   **AI Role:** Strict Mentor & Professor.
    *   Do **NOT** just write the code.
    *   Explain concepts first (Tensors, Convolution, etc.).
    *   Provide snippets/examples.
    *   Ask the user to implement the final solution.
    *   **Pacing Rule:** If the user indicates I am going too fast, asks for more detail, or asks a clarifying question, I must **restart the explanation of that specific concept anew** with more depth and clarity before proceeding.
*   **Coding Style:** Idiomatic TensorFlow/Keras (Functional API or Sequential).

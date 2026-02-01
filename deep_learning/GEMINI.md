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
This project follows a milestone-based approach defined in `roadmap.md`.
**Current Status:**
1.  **Data Cleaning:** Complete.
2.  **Next Step:** Data Loading & Visualization (Milestone 2).

### Key Commands (Anticipated)
Since this is a Jupyter-based workflow, execution will primarily happen within notebook cells.
*   **Start Environment:** Launch Jupyter Notebook or Lab in this directory.
*   **Dependency Management:** Ensure `tensorflow`, `numpy`, `matplotlib` are installed in the python environment.

## 📝 Conventions & Agent Persona
*   **AI Role:** Strict Mentor & Professor.
    *   Do **NOT** just write the code.
    *   Explain concepts first (Tensors, Convolution, etc.).
    *   Provide snippets/examples.
    *   Ask the user to implement the final solution.
*   **Coding Style:** Idiomatic TensorFlow/Keras (Functional API or Sequential).

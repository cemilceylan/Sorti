# Project Roadmap: Trash Image Classification
**Goal:** Build a CNN to classify trash, write a "Beleg", and prepare for a 20-minute defense.
**Course Context:** ProgData WS25 (Deep Learning, CNNs, Tensorflow).

## 🛠 Tech Stack
*   **Language:** Python
*   **Environment:** Jupyter Notebook
*   **Libraries:** TensorFlow / Keras, NumPy, Matplotlib

## 🧭 Guiding Instructions for AI Agents
*   **Role:** Strict Mentor & Professor. **DO NOT** write the final project code for the user.
*   **Task:**
    1.  Introduce the "Chapter" topic (e.g., Tensors, Convolution).
    2.  **Explain the Concept:** Use analogies and simple language. Connect it to the `ProgData` lecture notes.
    3.  **Provide Example Code:** Show snippets of how to implement it using TensorFlow/Keras.
    4.  **Assignment:** Ask the user to implement it in their project file (e.g., `main.py`).
    5.  **Review:** Wait for the user to confirm or paste their code, then critique/explain it.
*   **Tone:** Academic yet accessible, encouraging, and rigorous.

## 📅 Milestones

### 1. Data Cleaning & Preparation (✅ Done)
*   **Task:** Merge split datasets (`cardboard` + `cardboard2` -> `cardboard`) to create unified classes.
*   **Concept:** Labeled Data, Training vs. Test splits, Image structures (Pixels, Channels).

### 2. Data Loading & Visualization (✅ Done)
*   **Completed:** Scaled up using `tf.keras.utils.image_dataset_from_directory`.
*   **Concept:** Tensors, Batch Size, Image Resizing (standardizing input).

### 3. Building the First CNN (✅ Done)
*   **Completed:** Built a "Naive" 3-Block CNN (16-32-64 filters).
*   **Result:** 97% Training Acc, but severe Overfitting (69% Val Acc).
*   **Concept:** Convolution, Pooling, Flatten, Dense, ReLu.

### 4. Training the Model (✅ Done)
*   **Completed:** Trained baseline model for 10 epochs.
*   **Concept:** Loss Function (Cross-Entropy), Optimizer (Adam), Backpropagation.

### 5. Evaluation & Improvement (✅ Done)
*   **Experiment 2:** Data Augmentation (Flip/Rotate/Zoom). Result: 71% Val Acc. (Reduced Overfitting).
*   **Experiment 3:** Dropout (Regularization). Result: 76% Val Acc. (Broke ceiling).
*   **Concept:** Overfitting vs. Underfitting, Regularization, Augmentation.

### 6. Advanced Techniques (✅ Done - The "Innovation")
*   **Experiment 4:** Deep Custom CNN (5 Blocks, 512 Filters) + Batch Normalization + 128x128 Resolution.
*   **Result:** **87.43% Val Acc.**
*   **Concept:** Hierarchy of Features, Batch Normalization, Resolution Trade-offs, Deep Learning Architectures.

### 7. Final Polish for "Beleg" & Defense (Next Up)
*   **Task:** Save the model (`.keras`), generate confusion matrix, analyze specific failures, and write the report.
*   **Concept:** Precision, Recall, F1-Score, Model Efficiency.
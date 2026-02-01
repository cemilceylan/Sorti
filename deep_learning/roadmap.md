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

### 1. Data Cleaning & Preparation (Done)
*   **Task:** Merge split datasets (`cardboard` + `cardboard2` -> `cardboard`) to create unified classes.
*   **Concept:** Labeled Data, Training vs. Test splits, Image structures (Pixels, Channels).

### 2. Data Loading & Visualization
*   **Task:** Use `tf.keras.utils.image_dataset_from_directory`.
*   **Concept:** Tensors, Batch Size, Image Resizing (standardizing input).

### 3. Building the First CNN (The "Hello World")
*   **Task:** Create a simple Convolutional Neural Network.
*   **Concept:**
    *   **Convolution:** Feature extraction (Edges, Textures).
    *   **Pooling:** Reducing complexity (Downsampling).
    *   **Flatten & Dense:** Decision making.
    *   **Activation Functions:** ReLu (Linearity breaker), Softmax (Probabilities).

### 4. Training the Model
*   **Task:** `model.fit()`.
*   **Concept:**
    *   **Loss Function:** Cross-Entropy (measuring error).
    *   **Optimizer:** Adam/SGD (adjusting weights).
    *   **Backpropagation:** How the network learns from mistakes.
    *   **Epochs:** Iterations over the dataset.

### 5. Evaluation & Improvement
*   **Task:** Analyze Accuracy graphs.
*   **Concept:** Overfitting vs. Underfitting (Bias/Variance trade-off).

### 6. Advanced Techniques (The "Innovation")
*   **Task:** Data Augmentation & Transfer Learning (MobileNet/VGG).
*   **Concept:** Using pre-trained "knowledge", regularization (Dropout).

### 7. Final Polish for "Beleg" & Defense
*   **Task:** Generate confusion matrix, save model, explain results.
*   **Concept:** Precision, Recall, F1-Score, Model Efficiency.

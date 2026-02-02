# Sorti: Experimental Results & Analysis

This document tracks the detailed metrics, visual insights, and strategic decisions for each of the three experimental runs.

---

## Run 1: The Baseline (Naive Model)
**Configuration:**
*   **Architecture:** 3-Block CNN (16, 32, 64 filters).
*   **Resolution:** 128x128 (Resized).
*   **Regularization:** None (No Dropout, No Augmentation).
*   **Epochs:** 20.

### 1. The Data (Epoch-by-Epoch)
*Reconstructed from `results/run1.png`*

| Epoch | Train Accuracy | Val Accuracy | Train Loss | Val Loss | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | 43.72% | 54.92% | 1.5694 | 1.2698 | Learning |
| **2** | 62.89% | 63.45% | 1.0806 | 1.0929 | |
| **3** | 71.90% | 63.91% | 0.8159 | 1.1426 | |
| **4** | 79.62% | 70.90% | 0.6021 | **0.9393** | **Optimal Model** |
| **5** | 85.95% | 73.59% | 0.4132 | 0.9602 | Overfitting Starts |
| **6** | 91.79% | 73.06% | 0.2583 | 1.0460 | |
| **7** | 94.44% | 72.08% | 0.1769 | 1.2536 | |
| **8** | 96.79% | 74.02% | 0.1064 | 1.2165 | |
| **9** | 96.57% | 72.90% | 0.1053 | 1.3655 | |
| **10** | 97.12% | 75.36% | 0.0901 | 1.4674 | Severe Overfitting |
| **11** | 98.03% | 74.93% | 0.0668 | 1.6471 | |
| **12** | 97.66% | 74.90% | 0.0781 | 1.6249 | |
| **13** | 98.10% | 74.74% | 0.0598 | 1.6861 | |
| **14** | 98.86% | 75.10% | 0.0348 | 1.7120 | |
| **15** | 99.07% | 74.51% | 0.0345 | 1.8503 | "Memorization" |
| **16** | 98.16% | 73.85% | 0.0570 | 1.8242 | |
| **17** | 98.40% | 75.59% | 0.0505 | 1.9106 | |
| **18** | 98.56% | 73.56% | 0.0456 | 2.0168 | |
| **19** | 98.38% | 73.26% | 0.0507 | 2.0952 | |
| **20** | 98.87% | 75.66% | 0.0387 | 1.9244 | Final State |

### 2. Visual Insights & Analysis
*   **The "Alligator Mouth":** Looking at the graph, the gap between *Training Accuracy* (blue) and *Validation Accuracy* (orange) opens wide after Epoch 4. This gap represents the model's inability to generalize.
*   **The Loss Explosion:** While *Validation Accuracy* plateaus around 75%, the *Validation Loss* doubles from 0.95 to nearly 2.0.

#### Deep Dive: Why does Validation Loss RISE while Accuracy STAYS HIGH?
It comes down to **"Arrogance"**.

1.  **Accuracy is Binary:** It just asks, "Did you pick the right winner?"
    *   If the model predicts: `Trash (51%)`, `Metal (49%)` -> **Correct.**
    *   If the model predicts: `Trash (99%)`, `Metal (1%)` -> **Correct.**
    *   To the Accuracy metric, these are identical ($1.0$).

2.  **Loss is Probabilistic (Cross-Entropy):** It measures "How confident (and wrong) were you?"
    *   If the model is **Wrong** but unsure (`Trash 49%`, `Metal 51%`), the penalty is small.
    *   If the model is **Wrong** and arrogant (`Trash 1%`, `Metal 99%`), the penalty (Loss) is **huge**.

**In Run 1:** Your model is overfitting. It is memorizing the training data so hard that it becomes "overconfident." When it sees a validation image it doesn't recognize, it guesses *wildly* and with high confidence.
*   **Result:** It gets about the same number of images right (~75%), but for the ones it gets wrong, it is **spectacularly wrong**, causing the Loss to explode from `0.95` to `2.0+`.

### 3. Conclusion for Run 1
The model has sufficient capacity to learn the dataset (evidenced by 99% Train Acc), but it lacks the discipline to generalize. It is memorizing noise and specific pixel patterns rather than the concept of "trash".

### 4. Next Step: Strategy (The Cure for Arrogance)
**Diagnosis:** The Run 1 model is "Lazy & Arrogant". It memorizes exact pixels instead of learning shapes.
**Prescription:** We need to make the learning task harder to force the model to be smarter.

**1. Data Augmentation (The "Chaos" Factor)**
*   **What:** Randomly flipping, rotating, and zooming input images during training.
*   **Why:** This destroys the model's ability to memorize specific pixel locations. A "crushed can" is no longer just "that pile of grey pixels in the bottom left corner"; it becomes a shape that persists regardless of orientation.
*   **Expected Impact:** Training Accuracy will drop (because the task is harder), but Validation Accuracy should stabilize.

2.  **Dropout (0.5):** Randomly disable 50% of neurons during training to prevent the model from relying on specific "memorized" pathways.
*   **Expected Impact:** This directly combats the "Arrogance" (Loss Explosion) by preventing the network from becoming too confident in any single weak feature.

---

## Run 2: The Regularized Model (The Generalist)
**Configuration:**
*   **Architecture:** Same 3-Block CNN as Run 1.
*   **Changes:** Added `RandomFlip`, `RandomRotation`, `RandomZoom` (input) and `Dropout(0.5)` (dense).
*   **Epochs:** 40 (Extended to allow for slower learning).

### 1. The Data (Epoch-by-Epoch)
*Data from Console Output*

| Epoch | Train Accuracy | Val Accuracy | Train Loss | Val Loss | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | 31.10% | 39.50% | 1.8835 | 1.6348 | Learning (Slow Start) |
| **2** | 42.89% | 50.92% | 1.6174 | 1.3811 | |
| **3** | 47.24% | 55.91% | 1.5080 | 1.2949 | |
| **4** | 50.33% | 56.43% | 1.4199 | 1.2518 | |
| **5** | 53.12% | 56.43% | 1.3513 | 1.3134 | |
| **6** | 54.21% | 58.30% | 1.3125 | 1.2269 | |
| **7** | 55.58% | 59.94% | 1.2852 | 1.2109 | |
| **8** | 57.54% | 60.20% | 1.2311 | 1.2016 | Breaking 60% |
| **9** | 58.17% | 61.98% | 1.2039 | 1.1678 | |
| **10** | 59.72% | 62.40% | 1.1759 | 1.1459 | |
| **11** | 60.59% | 65.85% | 1.1402 | 1.0232 | |
| **12** | 61.60% | 63.52% | 1.1204 | 1.0947 | |
| **13** | 61.91% | 65.19% | 1.1061 | 1.0492 | |
| **14** | 62.64% | 65.75% | 1.0741 | 1.0456 | |
| **15** | 64.07% | 65.06% | 1.0550 | 1.0949 | |
| **16** | 64.46% | 66.63% | 1.0320 | 1.0409 | |
| **17** | 64.72% | 67.42% | 1.0228 | 0.9438 | Valid Loss < 1.0 |
| **18** | 65.17% | 63.22% | 1.0100 | 1.1503 | |
| **19** | 66.55% | 67.32% | 0.9722 | 1.0092 | |
| **20** | 66.19% | 68.54% | 0.9809 | 0.9309 | |
| **21** | 66.59% | 68.86% | 0.9633 | 0.9744 | |
| **22** | 67.50% | 70.11% | 0.9497 | 0.9342 | Breaking 70% Val |
| **23** | 67.76% | 67.68% | 0.9330 | 0.9977 | |
| **24** | 68.78% | 66.73% | 0.9254 | 1.0160 | |
| **25** | 68.32% | 68.11% | 0.9177 | 1.0492 | |
| **26** | 68.64% | 69.19% | 0.9101 | 0.9627 | |
| **27** | 69.40% | 71.13% | 0.8810 | 0.9066 | |
| **28** | 69.51% | 71.10% | 0.8666 | 0.9015 | |
| **29** | 70.70% | 70.05% | 0.8598 | 0.9371 | |
| **30** | 69.71% | 70.34% | 0.8798 | 0.9675 | |
| **31** | 70.52% | 72.01% | 0.8465 | 0.8886 | |
| **32** | 71.11% | 72.41% | 0.8370 | 0.8965 | Stable Performance |
| **33** | 71.06% | 70.87% | 0.8416 | 0.9438 | |
| **34** | 71.06% | 70.21% | 0.8289 | 0.9942 | |
| **35** | 71.13% | 72.47% | 0.8366 | **0.8562** | **Lowest Val Loss** |
| **36** | 71.88% | 71.88% | 0.8205 | 0.8973 | |
| **37** | 71.68% | 71.29% | 0.8180 | 0.9263 | |
| **38** | 73.06% | 72.90% | 0.7858 | 0.8764 | |
| **39** | 72.56% | 68.50% | 0.7980 | 1.1024 | Instability |
| **40** | 72.59% | 71.39% | 0.7944 | 0.9179 | Final Result |

### 2. Visual Insights & Analysis
*   **The "Humble" Model:** Unlike Run 1, the Training Accuracy (72.6%) and Validation Accuracy (71.4%) are almost identical.
*   **Success:** We have completely eliminated the "Arrogance" (Overfitting). The "Alligator Mouth" is closed.
*   **The "Ceiling":** Despite training for 40 epochs (twice as long as Run 1), we cannot break the ~72% accuracy barrier. The lines are flat.

#### Deep Dive: Why is the accuracy stuck at ~72%?
The Regularization worked *too* well. By making the task harder (Augmentation) and the brain smaller (Dropout), we have reached the **Capacity Limit** of the 3-Block architecture.
*   **Analogy:** You cannot teach a toddler (3-Block CNN) to solve calculus (Fine-grained classification) just by making the exam harder (Augmentation). You need a smarter student.

### 3. Conclusion for Run 2
We have successfully traded "Memorization" for "Generalization". The model is robust, but it is not smart enough to distinguish subtle differences (like a crushed can vs. crumpled paper) because it lacks **Depth**.

### 4. Next Step: Strategy (The Brain Transplant)
**Objective:** Break the 72% ceiling and aim for >85%.
**Action:** Increase Model Capacity & Stability.
1.  **Go Deeper (5 Blocks):** Increase from 3 blocks to 5 blocks (up to 512 filters). This gives the model the "brain power" to learn high-level abstractions.
2.  **Batch Normalization:** Deep networks are unstable. Batch Norm fixes this by re-centering the data at every layer, allowing the "smarter" brain to learn without getting confused.
3.  **L2 Regularization:** To keep the weights of this massive new brain in check.

---

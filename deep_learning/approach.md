# Sorti: Experimental Approach

This document outlines the strategic narrative for the project's experiments, focusing on a clear 3-run progression for the final "Beleg" and defense.

---

## The 3-Act Structure

To demonstrate a mastery of Deep Learning principles, the experiments are consolidated into three distinct phases. This narrative shows how we identified problems, implemented theoretical solutions, and reached the final architecture.

### 1. Run 1: The Baseline (The "Naive" Model)
*   **Goal:** Establish a baseline performance and identify the primary challenge of the dataset.
*   **Configuration:** Simple 3-Block CNN (16, 32, 64 filters), 256x256 resolution, No Regularization.
*   **Expected Outcome:** Severe Overfitting. High training accuracy (>95%) vs. poor validation accuracy (~65-69%).
*   **Key Lesson:** Proves the model is memorizing specific pixels rather than learning generalized features.

### 2. Run 2: The Regularization Phase (The "Generalist")
*   **Goal:** Bridge the gap between training and validation performance.
*   **Configuration:** Same 3-Block architecture + **Data Augmentation** (Flip, Rotate, Zoom) + **Dropout (0.5)**.
*   **Expected Outcome:** Stabilized loss and reduced overfitting gap. Accuracy hits a "ceiling" (likely ~75-78%).
*   **Key Lesson:** Regularization forces the model to learn robust features, but the limited depth prevents it from capturing high-level abstractions.

### 3. Run 3: The Deep Champion (The "Specialist")
*   **Goal:** Break the accuracy ceiling and reach production-level performance.
*   **Configuration:** 5-Block CNN (up to 512 filters), **Batch Normalization**, 128x128 resolution, **Learning Rate Scheduling**.
*   **Expected Outcome:** Peak Accuracy (>85%). Significantly lower validation loss.
*   **Key Lesson:** Combining high network capacity (depth) with stability layers (Batch Norm) allows the model to differentiate complex, visually similar classes (e.g., Metal vs. Plastic).

---

## Documentation Strategy
*   **Charts:** Each run must generate a consistent Accuracy/Loss plot saved in `results/`.
*   **Diagnostics:** Only the Champion (Run 3) will undergo full diagnostic analysis (Confusion Matrix and Classification Report).
*   **Comparison:** A final summary table in the Beleg will compare these three runs to justify the architectural evolution.

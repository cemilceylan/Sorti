# Sorti: Training Results Log

This document tracks the experiments, configurations, and results of our model training runs.

---

## Experiment 1: The "Naive" Model (Baseline)
*   **Date:** Feb 1, 2026
*   **Architecture:** 3-Block CNN (16, 32, 64 filters).
*   **Image Size:** 256x256
*   **Augmentation:** None.
*   **Epochs:** 10

### Results (Epoch 10)
*   **Training Accuracy:** 97.7%
*   **Validation Accuracy:** 69.4%
*   **Validation Loss:** 2.29 (Doubled from Epoch 3)

### Epoch-by-Epoch Data
| Epoch | Accuracy | Loss | Val Accuracy | Val Loss |
| :--- | :--- | :--- | :--- | :--- |
| 1 | 42.01% | 1.6327 | 55.35% | 1.3132 |
| 2 | 65.03% | 1.0362 | 58.60% | 1.2499 |
| 3 | 78.34% | 0.6570 | 63.42% | 1.2120 |
| 4 | 88.23% | 0.3608 | 69.52% | 1.2984 |
| 5 | 94.43% | 0.1853 | 69.23% | 1.6755 |
| 6 | 96.11% | 0.1298 | 70.96% | 1.7194 |
| 7 | 96.98% | 0.0922 | 71.36% | 1.8191 |
| 8 | 96.82% | 0.1009 | 71.72% | 1.8436 |
| 9 | 98.04% | 0.0619 | 70.34% | 2.1060 |
| 10 | 97.71% | 0.0787 | 69.46% | 2.2927 |

### Analysis
*   **Diagnosis:** Severe Overfitting. The model achieved near-perfect accuracy on training data but failed to generalize to the validation set. The validation loss actually increased (worsened) as training progressed, confirming memorization.
*   **Action:** Implement Data Augmentation to force the model to learn robust features.

---

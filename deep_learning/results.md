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

## Experiment 2: Data Augmentation
*   **Date:** Feb 1, 2026
*   **Architecture:** Same as Exp 1 + Augmentation Layers (Flip, Rotate, Zoom).
*   **Epochs:** 20 (Extended from 10).

### Results (Epoch 20)
*   **Training Accuracy:** 81.2% (Dropped from 97.7% in Exp 1, which is good/expected).
*   **Validation Accuracy:** 71.7% (Slight improvement over 69.4%).
*   **Validation Loss:** 0.99 (Significantly better/lower than 2.29).

### Key Data Points
| Epoch | Accuracy | Loss | Val Accuracy | Val Loss | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 35.48% | 1.7892 | 49.84% | 1.4342 | |
| 2 | 52.55% | 1.3507 | 54.23% | 1.3088 | |
| 3 | 57.97% | 1.2137 | 57.09% | 1.3001 | |
| 4 | 61.14% | 1.1288 | 64.01% | 1.0954 | |
| 5 | 63.78% | 1.0598 | 56.86% | 1.3066 | |
| 6 | 65.56% | 0.9970 | 64.70% | 1.1348 | |
| 7 | 68.26% | 0.9283 | 65.91% | 1.0594 | |
| 8 | 69.74% | 0.8901 | 65.22% | 1.1082 | |
| 9 | 70.88% | 0.8552 | 67.06% | 1.0383 | |
| 10 | 72.12% | 0.8239 | 68.50% | 1.0147 | |
| 11 | 74.01% | 0.7671 | 67.95% | 1.0504 | (Extension Start) |
| 12 | 75.18% | 0.7435 | 69.46% | 0.9807 | Lowest Loss |
| 13 | 75.86% | 0.7165 | 68.93% | 1.0217 | |
| 14 | 77.16% | 0.6759 | 67.29% | 1.0370 | |
| 15 | 77.54% | 0.6581 | 71.06% | 0.9936 | |
| 16 | 78.45% | 0.6447 | 62.86% | 1.2856 | Instability Spike |
| 17 | 79.04% | 0.6258 | 70.41% | 1.0127 | |
| 18 | 80.03% | 0.5975 | 70.64% | 1.0203 | |
| 19 | 80.76% | 0.5756 | 70.44% | 1.0334 | |
| 20 | 81.17% | 0.5558 | 71.69% | 0.9857 | Plateau |

### Analysis & Comparison
1.  **Overfitting Tamed (Partially):**
    *   **Run 1:** The gap between Train/Val was massive (~28%).
    *   **Run 2:** The gap has shrunk to ~10%. The model is no longer "cheating" by memorizing exact pixels.
2.  **Loss Stability:**
    *   In Run 1, validation loss exploded to **2.29**.
    *   In Run 2, validation loss stabilized around **1.0**. This proves the model is learning generalized features.
3.  **The "Glass Ceiling":**
    *   Despite training for 20 epochs, validation accuracy hit a wall at **~71%**.
    *   Training accuracy kept climbing (81%), hinting that we are starting to overfit again, just more slowly.

*   **Diagnosis:** We have maximized what this architecture can do with just augmentation. The model still has too many parameters in the Dense layer, allowing it to eventually memorize even the augmented data.
*   **Action:** Implement **Dropout** to randomly sever connections during training, forcing the network to be more robust and closing the 10% gap.
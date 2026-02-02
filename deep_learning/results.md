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

---

## Experiment 2: Data Augmentation
*   **Date:** Feb 1, 2026
*   **Architecture:** Same as Exp 1 + Augmentation Layers.
*   **Epochs:** 20

### Results (Epoch 20)
*   **Training Accuracy:** 81.17%
*   **Validation Accuracy:** 71.69%
*   **Validation Loss:** 0.9857

### Full 20-Epoch Data
| Epoch | Accuracy | Loss | Val Accuracy | Val Loss | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 35.48% | 1.7892 | 49.84% | 1.4342 | |
| 5 | 63.78% | 1.0598 | 56.86% | 1.3066 | |
| 10 | 72.12% | 0.8239 | 68.50% | 1.0147 | |
| 15 | 77.54% | 0.6581 | 71.06% | 0.9936 | Peak performance region |
| 20 | 81.17% | 0.5558 | 71.69% | 0.9857 | Plateau reached |

---

## Experiment 3: Dropout (The Marathon)
*   **Date:** Feb 1, 2026
*   **Architecture:** 3-Block CNN + Augmentation + **Dropout(0.5)** before Dense Layer.
*   **Epochs:** 40
*   **Goal:** Break the 71% ceiling by reducing model capacity for memorization.

### Results (Peak at Epoch 30)
*   **Training Accuracy:** 88.4%
*   **Validation Accuracy:** **76.25%**
*   **Validation Loss:** 1.02

### Full 40-Epoch Data
| Epoch | Accuracy | Loss | Val Accuracy | Val Loss | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 39.45% | 1.6840 | 43.57% | 1.6039 | Slow start due to Dropout |
| 5 | 65.58% | 1.0024 | 65.26% | 1.0638 | |
| 10 | 74.82% | 0.7363 | 63.52% | 1.2529 | |
| 15 | 80.03% | 0.5786 | 73.92% | 0.9050 | Breaking 73% |
| 20 | 84.07% | 0.4701 | 70.24% | 1.0844 | |
| 25 | 86.21% | 0.4004 | 75.23% | 0.9409 | Strong performance |
| 30 | 88.41% | 0.3403 | **76.25%** | 1.0189 | **PEAK PERFORMANCE** |
| 35 | 89.82% | 0.3011 | 74.84% | 1.1770 | Overfitting begins |
| 40 | 91.24% | 0.2690 | 73.20% | 1.2946 | Loss increasing |

---

## Experiment 4: The "Deep Custom Model" (Final)
*   **Date:** Feb 1, 2026
*   **Epochs:** 100
*   **Goal:** Break the 80% accuracy barrier by significantly increasing model capacity (Intelligence) while maintaining stability.
*   **Raw Data:** See `run_4.md` for the complete 100-epoch table.

### Strategic Decisions (The "Why")
1.  **Architecture Upgrade (3 Blocks $\rightarrow$ 5 Blocks):**
    *   *Problem:* Exp 3 peaked at 76%. The 3-Block model simply couldn't distinguish complex features (e.g., crushed can vs. crumpled paper).
    *   *Solution:* We added 2 more Convolutional blocks, ending with **512 filters**. This allows the model to learn high-level abstractions essential for fine-grained classification.
2.  **Batch Normalization:**
    *   *Problem:* Deep networks are notoriously hard to train (gradients vanish/explode).
    *   *Solution:* Added `BatchNormalization` after every Conv layer. This stabilized the learning process, allowing us to train for 100 epochs without the loss exploding (unlike Exp 1).
3.  **Resolution Trade-off (256px $\rightarrow$ 128px):**
    *   *Problem:* A 5-Block model with 256x256 images would require massive RAM and parameters.
    *   *Solution:* Reduced input to **128x128**. We sacrificed pixel density to gain **Network Depth**. This proved to be the correct trade-off: a smarter brain looking at a smaller image beats a dumb brain looking at a large image.

### Results (Peak at Epoch 62)
*   **Training Accuracy:** 95.3%
*   **Validation Accuracy:** **87.43%** (New Record)
*   **Validation Loss:** 0.54 (Lowest ever)

### Comparative Analysis
*   **vs. Run 1 (Baseline):** We improved accuracy by **+18%** (69% $\rightarrow$ 87%) and reduced loss by **4x** (2.29 $\rightarrow$ 0.54).
*   **vs. Run 3 (Dropout):** Adding depth and Batch Norm gained us **+11%** accuracy over the Dropout-only model.
*   **Conclusion:** The combination of **Depth + Batch Norm + Dropout + Augmentation** is the winning formula for this dataset.

*   **Status:** **PROJECT COMPLETE. MODEL SAVED.**

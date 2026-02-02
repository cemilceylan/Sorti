# Sorti: Final Beleg & Defense Preparation Guide

This document outlines the final steps for completing the project paper (Beleg) and preparing for the 20-minute defense.

---

## 1. The "Beleg" (Report) Structure
Use the following structure for your written assignment. You can lift detailed explanations directly from `results.md` and `teachings.md`.

*   **Introduction:** 
    *   Goal of the project (Automated Trash Classification).
    *   Why it is challenging (High variance in biological waste, reflectivity of materials).
*   **Methodology (The Evolution):**
    *   **Phase 1: Baseline.** Simple 3-Block CNN. Findings: Severe Overfitting (97% Train vs 69% Val).
    *   **Phase 2: Regularization.** Introduction of Data Augmentation and Dropout. Findings: Stabilization of loss, reduced gap.
    *   **Phase 3: The Deep Champion.** 5-Block CNN with 512 Filters and Batch Normalization. Choice of 128x128 resolution.
*   **Results:**
    *   Use the summary table from `results.md`.
    *   Cite the **87.43% Peak Accuracy**.
    *   Explain the Final State (85.01%) vs. Peak State (Model optimization dynamics).
*   **Discussion & Diagnostics:**
    *   **The "Metal Paranoia":** Model confuses shiny plastic/glass with metal.
    *   **The "Biological Ambiguity":** Lack of consistent visual features in bio-waste.
    *   **The "Alphabet Analogy":** Justification for 512 filters (High-level abstraction).

---

## 2. The Defense Presentation (20 Minutes)
Aim for ~8-10 slides. Focus on "Why?" and "What did you learn?"

*   **Slide 1: Title & Overview.** (Sorti Project - WS25).
*   **Slide 2: The Data.** Show a 3x3 grid of your 128x128 trash images.
*   **Slide 3: The Failure (Run 1).** Show the Overfitting graph. Explain why memorization is not learning.
*   **Slide 4: The Fix (Augmentation/Dropout).** Explain how we "punished" the student to force generalization.
*   **Slide 5: The Architecture.** Show the 5-Block structure. Explain **Batch Normalization** (stabilizer) and the **512 Filters** (Lego/Alphabet analogy).
*   **Slide 6: Final Results.** Show the Run 4 Accuracy/Loss graph.
*   **Slide 7: Confusion Matrix.** Show `confusion_matrix.png`. Point out the Metal and Biological clusters.
*   **Slide 8: Conclusion & Future Work.** Hand-made custom models vs. Transfer Learning. Mention Color/Contrast augmentation as the next step.

---

## 3. Live Demo (Optional "Mic Drop")
To impress the professor, you can perform a live classification:
1.  Open a new Jupyter Notebook cell.
2.  `model = tf.keras.models.load_model('sorti_model_final_85acc.keras')`.
3.  Load a single image from the `test/` folder.
4.  `model.predict()` and print the class name.

---

**Status:** ALL SYSTEMS GO. Good luck! 🚀

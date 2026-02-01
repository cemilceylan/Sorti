# Sorti: Deep Learning Concepts & Teachings

This document tracks the theoretical concepts, practical techniques, and "Why?" explanations covered during the development of the Sorti trash classification project. It is designed as a study guide for the final defense.

---

## 1. The Data Pipeline

### 1.1. Why Batches?
Deep Learning models do not learn from single images one by one; it is too slow and unstable.
*   **Batching:** We group images (e.g., 32 at a time) into a **Batch**.
*   **Stability:** The model calculates the error for the *entire* batch before making an update. This prevents a single weird image from throwing off the learning process.
*   **Tensor Shape:** A batch of images is a 4D Tensor: `(Batch_Size, Height, Width, Channels)`.

### 1.2. The Validation Split
*   **Concept:** Dividing data into a "Study Pile" (Training) and a "Quiz Pile" (Validation).
*   **Purpose:** To detect **Overfitting** (memorization). We train on the Study Pile but grade the model on the Quiz Pile.
*   **The Seed:** A "Shuffle Recipe". We must use the same `seed` (e.g., `123`) for both the training and validation splits. This guarantees that the two piles are perfectly complementary (no overlap, no missing files). If the seed differs, an image could end up in both piles, which is "cheating."

### 1.3. Pipeline Optimization (Prefetching)
Even on CPU-only machines, we must optimize the flow of data.
*   **The Bottleneck:** The CPU has to load/resize images *and* do the math for training.
*   **Prefetching (`.prefetch(AUTOTUNE)`):** Uses a background thread to load/resize the *next* batch of images while the model is currently training on the *current* batch. This parallel processing ensures the training math never waits for data loading.

---

## 2. Image Preprocessing

### 2.1. Rescaling (Normalization)
*   **The Problem:** Digital images store colors as integers from **0 to 255** (8-bit).
*   **The Solution:** Neural Networks work best with small, floating-point numbers (0.0 to 1.0).
*   **Implementation:** We divide by 255.
    *   `255` (White) $ightarrow$ `1.0`
    *   `0` (Black) $ightarrow$ `0.0`
    *   `127` (Gray) $ightarrow$ `~0.5`
*   **Why?** Large inputs (like 255) can cause "exploding gradients" where the math becomes unstable. Small inputs keep the math well-behaved.

---

## 3. The Convolutional Neural Network (CNN) architecture

A CNN is a stack of layers, each transforming the data from pixels into abstract concepts.

### 3.1. Conv2D (The Feature Finder)
*   **Role:** Scans the image to find specific features (lines, edges, textures).
*   **Kernel (The Window):** A small matrix (usually **3x3**) that slides over the image.
*   **Filters (The Number):** e.g., `Conv2D(16, ...)` means we have 16 different kernels.
    *   **Strategy:** Start with fewer filters (16, 32) in early layers to capture simple shapes. Increase filters (64, 128) in deeper layers to capture complex objects (bottles, cans).

### 3.2. Activation Function: ReLU
*   **Role:** The "Gatekeeper" that introduces non-linearity.
*   **Formula:** $f(x) = max(0, x)$.
*   **Logic:**
    *   **Positive Input:** "Signal Found!" $ightarrow$ Pass it through.
    *   **Negative Input:** "No Match." $ightarrow$ Output 0 (Silence).
*   **Benefit:** Efficient, sparse (many zeros), and solves the "Vanishing Gradient" problem found in older functions.

### 3.3. MaxPooling2D (The Compressor)
*   **Role:** Summarizes the features found by the Conv2D layer.
*   **Mechanism:** Looks at a 2x2 grid and keeps only the **largest** number.
*   **Benefit:**
    1.  **Reduces Size:** Cuts height/width by half (4x fewer pixels).
    2.  **Invariance:** Makes the model care about *what* is there, not exactly *where* it is (pixel-perfect precision is unnecessary).
*   **The Paradox of Parameters:** Adding more Convolutional/Pooling layers can actually *decrease* the total number of parameters. This is because additional pooling reduces the size of the data before it hits the massive "Flatten" layer, saving millions of weights in the final Dense layers.

---

## 4. Training & Optimization

### 4.1. What are Parameters?
Parameters (often called "weights") are the learnable parts of the model. They are the "knobs" that the Optimizer adjusts during training.
*   **Weights ($w$):** Determine the importance of an input.
*   **Biases ($b$):** Allow the neuron to fire even if inputs are zero.
*   **Total Params:** The sum of all weights and biases in the network. This number represents the "Capacity" or "Brain Size" of the model. A model with too many parameters for a small dataset will Overfit (memorize).

### 4.2. Calculating Parameters (The Math)
Understanding how to count parameters is crucial for optimizing model size.

**1. Conv2D Layer Formula:**
$$Param \# = ((Kernel\_Height \times Kernel\_Width \times Input\_Channels) + 1\_Bias) \times Number\_of\_Filters$$
*   *Example:* Conv2D(32, 3x3) taking input with 16 channels.
*   $((3 \times 3 \times 16) + 1) \times 32 = (144 + 1) \times 32 = 4,640$

**2. Dense Layer Formula:**
$$Param \# = (Input\_Neurons \times Layer\_Neurons) + Layer\_Neurons\_(Bias)$$
*   *Example:* Dense(128) taking input from Flatten (65,536).
*   $(65,536 \times 128) + 128 = 8,388,736$

**3. Pooling & Flatten:**
*   **0 Parameters.** These are fixed mathematical operations (finding max, reshaping). There is nothing to learn.

---

## 5. Training Process

### 5.1. Compiling (The Setup)
Before training, the model must be "Compiled" with three key components:
1.  **Optimizer ('adam'):** The algorithm (Teacher) that updates the weights. It calculates *how* to change the parameters to reduce the error.
2.  **Loss Function ('SparseCategoricalCrossentropy'):** The grading scale. It calculates the mathematical distance between the model's prediction and the true label.
3.  **Metrics (['accuracy']):** A human-readable score (percentage correct) to monitor performance.

### 5.2. Fitting (The Learning)
*   **Epoch:** One complete pass through the entire training dataset.
*   **Process:**
    1.  Model sees a batch of images.
    2.  Calculates Loss.
    3.  Optimizer updates weights.
    4.  Repeats for all batches.
    5.  **Validation Check:** At the end of the epoch, the model is tested on the "Quiz Pile" (Validation Set) to check for Overfitting.

### 5.3. Visualizing Results
*   **The Graph:** We plot Accuracy and Loss over time.
*   **Goal:** Training and Validation lines should move together.
*   **Overfitting:** If Training Accuracy shoots up (99%) but Validation Accuracy stays low or drops, the model is memorizing.

---

## 6. Overfitting & Solutions

### 6.1. What is Overfitting?
Overfitting happens when the model "memorizes" the training data instead of learning general patterns.
*   **Symptom:** Training Accuracy is high (99%), but Validation Accuracy is low (60%).
*   **Graph:** The Training Loss goes down, but Validation Loss goes UP.

### 6.2. The Solution: Data Augmentation
We artificially increase the diversity of the training set by transforming the images.
*   **Techniques:** Random Rotation, Random Flip, Random Zoom.
*   **Effect:** The model never sees the exact same image twice. This makes the task *harder* (slower learning) but forces the model to learn robust features (e.g., "Glass looks like this from any angle") rather than cheating (e.g., "Glass is always in the center pixel").

### 6.3. Implementation
We add `tf.keras.layers.Random...` layers as the **first block** of the Sequential model.

### 6.4. Why not just add more layers?
A common mistake is to add more layers when the model isn't performing well.

#### 1. Capacity vs. Generalization
*   **Capacity (Intelligence):** Can the model learn the data?
*   **Generalization (Wisdom):** Can the model understand new data?

Look at your Experiment 1 results:
*   **Training Accuracy:** 98%
*   This proves your model **already has enough layers** (Capacity). It is smart enough to learn every single detail of your training images perfectly.

#### 2. The Danger of More Layers
If you add more layers to a model that is already Overfitting (Memorizing):
*   You are giving it a **bigger brain**.
*   A bigger brain is even *better* at memorizing.
*   Your Training Accuracy might hit 99.9%, but your Validation Accuracy would likely drop even lower (maybe to 60%).

#### 3. The Analogy
Imagine a student who memorizes the textbook word-for-word but fails the exam because the questions are phrased slightly differently.
*   **Adding Layers:** Giving that student a bigger notebook. Now they can memorize *even more* specific sentences. They still fail the exam.
*   **Augmentation:** Taking the student's textbook and constantly rewriting the sentences, changing the fonts, and ripping the pages. Now the student is forced to learn the *concepts* because they can't rely on the exact wording anymore.

**Conclusion:**
We only add layers if the model is "stupid" (e.g., gets stuck at 60% Training Accuracy).
Since your model is "smart but lazy" (98% Training), we punish it with **Augmentation**.

### 6.5. Dropout (Plan B)
If Augmentation isn't enough, we use Dropout to attack the "memorization" capacity of the model directly.
*   **The Analogy:** Imagine a group project where one "genius" student does all the work. If that student gets sick, the group fails. Dropout randomly "bans" 50% of the students (neurons) during each study session (epoch). This forces every student to learn the material, creating a more robust team.
*   **The Implementation:** We place a `Dropout(0.5)` layer right after the `Flatten()` layer.
*   **Why only before the Dense layer?**
    1.  **Conv Layers (The Eyes):** These share weights across the image. A typical Conv layer has ~500 to 5,000 parameters. It's hard to "over-memorize" with such a small capacity.
    2.  **Dense Layers (The Brain):** This is where the parameters explode. A single Dense layer can have **8.4 million parameters**. 99.9% of the model's memory capacity lives here.
    3.  **The Firewall:** Placing Dropout here acts as a firewall, stopping the massive Dense layer from conspiring to memorize exact training pixels.

---

## 7. The Science of Comparison

When comparing different experiments (Naive vs. Augmented vs. Dropout), we do not need to keep the epoch counts the same. In fact, doing so would be unscientific.

### 7.1. Convergence vs. Completion
Every model "converges" (reaches its top speed) at a different rate.
*   **Naive Model:** Learning is "fast but fake." It finds patterns (or cheats) in 5-10 epochs.
*   **Dropout Model:** Learning is "slow but real." Because we are making the task harder, the model needs more time (40+ epochs) to reach its potential. 

### 7.2. Metrics that Matter
In a final report, we compare **Best Performance**, not a fixed point in time.
1.  **Peak Validation Accuracy:** The highest score the model ever achieved on the Quiz Pile.
2.  **Lowest Validation Loss:** The point where the model was most "certain" and generalized best.
3.  **The Generalization Gap:** The distance between Training and Validation accuracy. A 2% gap is "healthy"; a 20% gap is "overfitting."

---

## 8. Next Steps
*   **Baseline First:** Do not start with complex techniques (like Data Augmentation). Build a simple "Naive" model first. Watch it fail (Overfit). Then apply the fix. This proves the value of your solution.

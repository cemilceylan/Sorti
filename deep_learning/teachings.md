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
    *   `255` (White) $ightarrow$ `1.0`
    *   `0` (Black) $ightarrow$ `0.0`
    *   `127` (Gray) $ightarrow$ `~0.5`
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
    *   **Positive Input:** "Signal Found!" $ightarrow$ Pass it through.
    *   **Negative Input:** "No Match." $ightarrow$ Output 0 (Silence).
*   **Benefit:** Efficient, sparse (many zeros), and solves the "Vanishing Gradient" problem found in older functions.

### 3.3. MaxPooling2D (The Compressor)
*   **Role:** Summarizes the features found by the Conv2D layer.
*   **Mechanism:** Looks at a 2x2 grid and keeps only the **largest** number.
*   **Benefit:**
    1.  **Reduces Size:** Cuts height/width by half (4x fewer pixels).
    2.  **Invariance:** Makes the model care about *what* is there, not exactly *where* it is (pixel-perfect precision is unnecessary).
*   **The Paradox of Parameters:** Adding more Convolutional/Pooling layers can actually *decrease* the total number of parameters. This is because additional pooling reduces the size of the data before it hits the massive "Flatten" layer, saving millions of weights in the final Dense layers.

### 3.5. Activation Functions: Sigmoid vs. ReLU vs. ELU
Choosing the right activation function for hidden layers is critical for gradient flow.

1.  **Sigmoid:** Squashes values to [0, 1].
    *   **The Problem:** Vanishing Gradient. For very large or small inputs, the slope is nearly zero. In deep networks, these tiny gradients multiply, causing the early layers to stop learning.
    *   **Usage:** Only for the output layer in **binary** classification.
2.  **ReLU (Rectified Linear Unit):** $f(x) = max(0, x)$.
    *   **The Benefit:** Constant gradient (1) for all positive values, solving the vanishing gradient problem. Extremely fast.
    *   **The Risk:** "Dying ReLU." Neurons that get stuck in the negative range output 0 and never recover.
3.  **ELU (Exponential Linear Unit):**
    *   **The Benefit:** Smooth curve for negative values. It keeps neurons "alive" and pushes the mean activation closer to zero, leading to faster convergence.

### 3.6. Output Layer: Softmax vs. Sigmoid
Since Sorti is a **Multi-Class** project (8+ types of trash), the output layer logic is specific.

*   **Softmax (Our Choice):** Turns the final scores into a probability distribution that **sums to 1.0**. Use this when an object can only belong to *one* category (e.g., an image is either 100% Glass or 100% Metal).
*   **Sigmoid (The Alternative):** Each output neuron acts independently (0 to 1). Use this for **Multi-Label** classification (e.g., an image contains *both* a bottle and a piece of paper). For Sorti, Sigmoid would be confusing because it wouldn't force the model to pick the "best" single category.

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

### 4.3. Weight Initialization: He Normal
*   **The Concept:** Initializing weights with a specific random distribution to ensure the signal doesn't vanish or explode as it passes through deep layers.
*   **Why not use the Default (Glorot/Xavier)?** Default initialization is mathematically optimized for symmetric activations like Sigmoid or Tanh.
*   **Why "He Normal"?** It is specifically designed for non-symmetric, "rectified" activations like ReLU and ELU.
*   **The Benefit:** It keeps the variance of the signal constant across layers. This leads to much more stable training in deep CNNs and prevents the model from getting stuck in the first few epochs.

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

## 8. Advanced Architecture (The "Deep Custom Model")

When a standard 3-Block CNN hits a "Glass Ceiling" (e.g., stuck at ~70% accuracy despite Augmentation and Dropout), it means the model is simply not smart enough to distinguish complex classes. We need to upgrade the brain.

### 8.1. Going Deeper (More Blocks)
*   **Concept:** Adding more Convolutional Blocks (e.g., 3 $ightarrow$ 5).
*   **Why?** Neural Networks learn a **Hierarchy of Features**:
    *   **Layers 1-2:** Detect edges, lines, and colors.
    *   **Layers 3-4:** Detect shapes, corners, and textures (e.g., "shiny surface").
    *   **Layers 5-6:** Detect complex objects (e.g., "bottle cap", "shoe lace", "logo text").
*   **The Upgrade:** By adding 4th and 5th blocks with 256 and 512 filters, we give the model the ability to "see" these high-level concepts essential for distinguishing trash types.

#### 8.1.1. The "Alphabet Analogy" (Why 512 Filters?)
A common confusion is: *"I thought more filters meant capturing more tiny details?"*
Actually, **"High Level"** in AI means **"Conceptually Complex"**, not "Tiny Detail."

**1. Layer 1 (16 Filters) = The Alphabet (Low Level)**
*   This layer looks at tiny groups of pixels.
*   It learns **Low-Level Details**: Vertical lines, horizontal lines, curves.
*   **Why few filters?** Because there are only a few basic ways to draw a line. You only need ~16 filters to capture all the edges in the universe.

**2. Layer 3 (128 Filters) = Words (Mid Level)**
*   This layer combines lines to make **Shapes**.
*   It sees: "Two vertical lines + one horizontal line = The letter H."
*   It learns: Circles, squares, corners.

**3. Layer 5 (512 Filters) = Sentences / Stories (High Level)**
*   This layer combines shapes to make **Abstractions**.
*   It sees: "A circle (Layer 3) + A metallic texture (Layer 3) + A cylinder shape (Layer 3) = **A Soda Can**."
*   **Why 512 filters?** Because there are **way more** complex objects in the world (Bottle caps, shoe laces, crumpled paper) than there are simple lines. We need a massive "dictionary" (512 filters) to store all these complex, high-level combinations.

#### 8.1.2. The Paradox of "More Filters"
*   **Early Layers:** We use **fewer filters** (32) because basic edges are simple.
*   **Deep Layers:** We use **more filters** (512) because the deeper we go, the more **combinations** exist.
    *   **Lego Analogy:**
    *   Layer 1: Only 10 types of bricks.
    *   Layer 5: You can combine them to build 10,000 different toys (Car, Plane, House). Layer 5 needs 512 "slots" to recognize the difference between a Lego Car and a Lego Plane.

> **Defense Summary:** "We increase the filters deeper in the network (up to 512) to capture the **Combinatorial Complexity** of the objects. While the early layers only need a few filters to detect simple edges, the final layers need a large capacity to recognize complex, high-level concepts like 'crumpled metal' versus 'torn paper'."

### 8.2. Batch Normalization (The Stabilizer)
As networks get deeper, they suffer from **Internal Covariate Shift**.
*   **The Problem:** Layer 5 is trying to learn, but the input signal from Layer 4 keeps shifting around because Layer 4 is also changing. It's like trying to shoot a moving target.
*   **The Solution:** `BatchNormalization()`.
*   **Mechanism:** After every layer, the model re-centers the data (Mean=0, Variance=1).
*   **Benefit:**
    1.  **Speed:** The network trains 10x faster because layers don't have to constantly re-adapt to shifting inputs.
    2.  **Stability:** It allows us to train very deep networks (like ResNet) without getting stuck.
    3.  **Regularization:** It adds a tiny bit of noise, which helps prevent overfitting.

### 8.3. The Resolution Trade-off (128x128 vs 256x256)
To afford a deeper brain (more layers), we often need to sacrifice resolution to save memory (RAM).
*   **256x256:** 65,536 pixels per channel. Great for tiny details, but computationally heavy.
*   **128x128:** 16,384 pixels per channel. 4x smaller!
*   **The Logic:** Most trash items (a bottle, a shoe) are recognizable even at lower resolutions. By shrinking the image, we free up massive amounts of memory, which we then "spend" on adding 200+ more filters to make the model smarter.
*   **Rule of Thumb:** It is usually better to have a **Smart Brain looking at a Small Image** than a **Dumb Brain looking at a Huge Image**.

---

## 9. Combatting Overfitting: Regularization & Callbacks

As we build deeper models, they become increasingly prone to **Overfitting**. We use two professional categories of tools to control this: **Mathematical Penalties (Regularization)** and **Training Supervisors (Callbacks)**.

### 9.1. Regularization (L2 / Weight Decay)

*   **What is it?** A mathematical "fine" added to the loss function based on the size of the weights ($W$).
*   **The Goal:** To prevent any single weight from becoming too large. Large weights usually mean the model is focusing too much on a specific pixel or feature (memorizing).
*   **How it works (The Math):**
    *   New Loss = Standard Loss + $\lambda \times \sum(W^2)$
    *   The $\lambda$ (Lambda) is the "strength" of the penalty (e.g., `0.001`).
*   **The Analogy:** Imagine a chef who uses *way* too much salt. L2 regularization is like a supervisor who charges the chef $1 for every gram of salt they use. The chef is forced to use salt sparingly and balance the flavor with other ingredients.
*   **Result:** The model is forced to distribute the learning across many weights, creating a more "balanced" and general understanding of the image.

### 9.2. Callbacks (The Automated Supervisors)

Callbacks are functions that run automatically at the end of every epoch. They "watch" the training and take action if things go wrong.

#### 1. EarlyStopping
*   **The Concept:** "Stop studying if you aren't getting any smarter."
*   **Why use it?** After a certain point, more training doesn't help—it actually hurts by causing overfitting.
*   **Parameters:**
    *   `monitor='val_loss'`: Watch the Quiz Pile's error.
    *   `patience=15`: Wait for 15 epochs. if the score doesn't improve, pull the plug.
    *   `restore_best_weights=True`: **CRITICAL.** If the model stops at Epoch 60, but the best version was at Epoch 45, this automatically rolls the model back to the state it was in at Epoch 45.

#### 2. TensorBoard
*   **The Concept:** A flight-recorder for your training.
*   **How it works:** It saves the accuracy and loss numbers into a log file on your hard drive.
*   **Benefit:** Instead of reading a wall of text in Jupyter, you can open a separate dashboard with smooth, interactive graphs to compare different runs (Run 1 vs Run 5).

### 9.3. Monitoring "Pure Error" vs. "Total Loss" (Why it matters with L2)

When we use **L2 Regularization**, the meaning of "Loss" changes, which can trick our EarlyStopping supervisor.

#### 1. The Components of Loss
*   **Pure Error (Prediction Error):** Did the model guess "Glass" when it was actually "Metal"? This is what we care about.
*   **Complexity Fine (L2 Penalty):** Is the model using huge weights? This is the "tax" we charge the model to prevent overfitting.
*   **Total Loss = Pure Error + Complexity Fine.**

#### 2. The Problem with `monitor='val_loss'`
As training progresses, the model might get really good at reducing the **Complexity Fine** (making weights smaller) even if its **Pure Error** (prediction accuracy) stops improving or gets slightly worse.
*   **The Illusion:** The `val_loss` (Total) keeps going down because the "Fine" is dropping.
*   **The Reality:** The model isn't getting smarter at classifying trash anymore.
*   **The Risk:** EarlyStopping keeps the training going too long because it thinks the model is still improving, leading to wasted time or late-stage overfitting.

#### 3. The Solution: `monitor='val_scc_metric'`
We tell EarlyStopping to ignore the "Fine" and only look at the **Pure Error** (Sparse Categorical Crossentropy).
*   **Analogy:** Imagine a student who gets graded on "Correct Answers" + "Neat Handwriting."
*   **Bad Monitoring:** The student stops studying but spends hours making their handwriting perfect. Their "Total Score" goes up, but they aren't learning.
*   **Good Monitoring:** We only look at the "Correct Answers" score. If that stops going up, we stop the study session, regardless of how neat the handwriting is.

---

## 10. Summary of the "Improved Model" (Run 5)

In Run 5, we combined every tool in our arsenal:
1.  **Data Augmentation:** Prevents the model from seeing the same image twice.
2.  **Batch Normalization:** Stabilizes the deep layers.
3.  **Dropout:** Stops the final "brain" layer from over-memorizing.
4.  **L2 Regularization:** Keeps the weights small and general.
5.  **EarlyStopping:** Saves us time and ensures we keep the best version of the weights.

---

## 11. The Dense Layer Paradox (One vs. Many)

In deep learning, you will see models with dozens of layers, but the type of layer matters.

### 11.1. Tabular Data (Why many Dense layers?)
Your professor's lecture example used many Dense layers (`Dense` $ightarrow$ `Dropout` $ightarrow$ `Dense` $ightarrow$ ...).
*   **The Reason:** The dataset (Higgs) consists of 30 simple numbers (tabular data). These numbers have no spatial relationship. The model must create "depth" by stacking many layers of neurons to find complex mathematical relationships between those 30 numbers.

### 11.2. Image Data (Why only one Dense layer?)
In your Sorti project, we use only one big Dense layer at the end.
*   **The Reason:** We have **Convolutional Layers** (Conv2D). 
    *   The Conv layers are the "thinking" part of the model. They do all the heavy lifting of understanding the image (edges, shapes, textures).
    *   By the time the data reaches the `Flatten()` layer, the hard work is done. The model already "knows" there is a shoe or a bottle.
*   **The Danger of Multiple Dense Layers in CNNs:**
    1.  **Parameter Explosion:** Dense layers are mathematically "heavy". One layer of 512 neurons can have millions of parameters. Stacking three of them would create a model with 20+ million parameters.
    2.  **Instant Overfitting:** Unless you have millions of images, a 20-million-parameter model will simply memorize your dataset in 2 epochs.
    3.  **Redundancy:** Since the Conv layers already extracted the high-level features, extra Dense layers often find nothing new to learn.

### 11.3. The Output Layer Logic
*   **Why `Dense(num_classes)`?** This creates the **Scoreboard**.
    *   If you have 9 trash types, you need 9 output slots.
    *   Neuron 0 = Battery Score.
    *   Neuron 8 = Shoes Score.
    *   If you used `Dense(100)`, you would have 100 scores and no idea which one belonged to "Shoes".
*   **The Loss Function:** The loss function (`SparseCategoricalCrossentropy`) compares this list of 9 scores against the single "True Answer" (e.g., Index 8). It needs the shapes to match exactly to calculate the grade.

### 11.4. The "Logits" Trick (Why no activation on the last layer?)
You will notice our code says:
`tf.keras.layers.Dense(num_classes)` (No activation)
`loss = SparseCategoricalCrossentropy(from_logits=True)`

*   **What are Logits?** Logits are the raw, unnormalized mathematical scores the model spits out (e.g., `[-0.5, 2.1, 15.3]`).
*   **The Confusion:** We *want* Softmax probabilities (e.g., `[0%, 1%, 99%]`). Why don't we put `activation='softmax'` on the last layer?
*   **The Reason (Numerical Stability):**
    *   If we use `activation='softmax'`, the model converts raw scores to tiny decimals (0.0000001).
    *   The Loss function then tries to take the Logarithm of that tiny decimal. Computers handle this poorly, leading to rounding errors or `NaN` (Not a Number) crashes.
    *   **The Fix:** By saying `from_logits=True`, we tell TensorFlow: "Here are the raw numbers. Please calculate the Softmax AND the Logarithm in one combined, mathematically safe step."
*   ** Equivalence:** `from_logits=True` **IS** Softmax logic. It is **NOT** Sigmoid.

---

## 12. Future Improvements & Advanced Techniques

To push the accuracy from **87%** to **95%+**, we would need to address the specific weaknesses identified in the Confusion Matrix (Metal vs. Plastic, Biological Ambiguity).

### 12.1. Transfer Learning (The Industry Standard)
*   **Concept:** Instead of training a model from scratch (random weights), we download a model like **MobileNetV2** or **ResNet50** that has already been trained on 14 million images (ImageNet).
*   **Why?** These models already know what "edges", "circles", and "textures" look like. We just teach them the specific difference between *our* trash types.
*   **Expected Gain:** Usually jumps straight to **90-95% accuracy** with very little training time.

### 12.2. Addressing "Metal Paranoia" (Contrast Augmentation)
*   **The Problem:** The model confuses shiny Plastic/Glass with Metal.
*   **The Fix:** Add `tf.keras.layers.RandomContrast` and `RandomBrightness`.
*   **Why?** By randomly changing the lighting and shine of the training images, the model is forced to stop relying solely on "brightness" as a feature for Metal. It must learn the *shape* of a crushed can vs. a smooth bottle.

### 12.3. Addressing "Biological Ambiguity" (Resolution)
*   **The Problem:** Biological waste (leaves, food) has fine textures that might be lost at 128x128 resolution.
*   **The Fix:** Increase input size to **224x224** or higher.
*   **Trade-off:** This requires more GPU memory and slower training, but it allows the model to see the "veins on a leaf" or the "pores on an orange peel," which are distinct from paper or cardboard.

### 12.4. Why NOT Color Augmentation?
*   **Idea:** `RandomHue` (changing colors).
*   **Risk:** Trash classes have specific color associations.
    *   **Brown:** Almost always Cardboard.
    *   **Green/Clear:** Often Glass.
    *   **Silver:** Metal.
*   **Danger:** If we make a Cardboard box "Blue", the model might think it's Plastic. Unlike "Contrast" (lighting), "Color" is often a valid signal for trash. We must be careful not to destroy useful information.

---

## 13. Next Steps
*   **Baseline First:** Do not start with complex techniques (like Data Augmentation). Build a simple "Naive" model first. Watch it fail (Overfit). Then apply the fix. This proves the value of your solution.

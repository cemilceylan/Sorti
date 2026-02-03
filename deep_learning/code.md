# Sorti: Utility & Cleaning Scripts

Use these scripts to resolve common environment and data errors.

---

## 1. Dataset Janitor (Fix: "Unknown image file format")
Run this script in a Colab cell if `model.fit` crashes with an `InvalidArgumentError`. It scans your `data/` directory and deletes hidden system files or corrupted images.

```python
import os
import tensorflow as tf

# Adjust this path to your Colab data directory (e.g., "/content/data")
data_dir = "data" 

print(f"Starting cleanup in: {data_dir}...")

deleted_count = 0
for root, dirs, files in os.walk(data_dir):
    for filename in files:
        file_path = os.path.join(root, filename)
        
        # 1. Remove hidden system files (like .DS_Store or .ipynb_checkpoints)
        if filename.startswith('.'):
            os.remove(file_path)
            deleted_count += 1
            continue

        # 2. Filter by extension
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
            print(f"Removing non-image file: {file_path}")
            os.remove(file_path)
            deleted_count += 1
            continue
            
        # 3. Verify image integrity with TensorFlow
        try:
            img_bytes = tf.io.read_file(file_path)
            # This will throw an error if the file is corrupted or empty
            tf.io.decode_image(img_bytes)
        except tf.errors.InvalidArgumentError:
            print(f"🗑️ Deleting CORRUPTED image: {file_path}")
            os.remove(file_path)
            deleted_count += 1
        except Exception as e:
            print(f"⚠️ Error checking {file_path}: {e}")

print(f"✅ Cleanup complete. Deleted {deleted_count} problematic files.")
print("👉 ACTION: Restart your Colab session and re-run your Data Loading cell.")
```

---

## 3. Run 4: The High-Res Specialist (Optimized Math)
This model is designed for **256x256** input. it uses **ELU** to prevent dying neurons and **He Normal** to maintain signal strength through the 5 blocks.

```python
num_classes = len(class_names)

model = tf.keras.Sequential([
    data_augmentation,
    tf.keras.layers.Rescaling(1./255),

    # Conv Block 1
    tf.keras.layers.Conv2D(32, 3, padding="same", use_bias=False, kernel_initializer="he_normal"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),

    # Conv Block 2
    tf.keras.layers.Conv2D(64, 3, padding="same", use_bias=False, kernel_initializer="he_normal"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),

    # Conv Block 3
    tf.keras.layers.Conv2D(128, 3, padding="same", use_bias=False, kernel_initializer="he_normal"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),

    # Conv Block 4
    tf.keras.layers.Conv2D(256, 3, padding="same", use_bias=False, kernel_initializer="he_normal"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),

    # Conv Block 5
    tf.keras.layers.Conv2D(512, 3, padding="same", use_bias=False, kernel_initializer="he_normal"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),

    # --- The Bridge ---
    tf.keras.layers.GlobalAveragePooling2D(),

    # Dense Block (The Classifier)
    tf.keras.layers.Dense(256, use_bias=False, kernel_initializer="he_normal"),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.Dropout(0.5),

    # Output Layer
    tf.keras.layers.Dense(num_classes)
])

# Compilation
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=['accuracy']
)

model.summary()
```
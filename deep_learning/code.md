# Code for Sorti Project (Run 5)

Copy the following blocks into your Jupyter Notebook to implement the improvements.

## 1. Updated Data Augmentation (Fixing Metal vs. Plastic)

Replace your existing `data_augmentation` definition with this one. It adds Contrast and Brightness changes to stop the model from relying on "shine".

```python
# Updated Data Augmentation with Lighting fixes
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal", input_shape=(img_height, img_width, 3)),
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
    # NEW: Fix for Metal vs. Plastic/Glass confusion
    # Forces model to learn shape/texture instead of just "brightness"
    tf.keras.layers.RandomContrast(0.2),
    tf.keras.layers.RandomBrightness(0.2)
])
```

## 2. Full Run 5 Code (Callbacks + Regularization + Training)

Copy this entire block into a new cell at the bottom of your notebook.

**Fix Applied:** I replaced `from tensorflow.keras import regularizers` with direct usage of `tf.keras.regularizers`. This prevents the "Import could not be resolved" error.

```python
import datetime
import tensorflow as tf # Ensure tf is imported

# --- 1. SETUP CALLBACKS ---
log_dir = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1)

early_stopping_callback = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss', 
    patience=15, 
    restore_best_weights=True
)

my_callbacks = [tensorboard_callback, early_stopping_callback]

# --- 2. DEFINE MODEL ---
num_classes = len(class_names)

model = tf.keras.Sequential([
    # Use the UPDATED data_augmentation defined above
    data_augmentation,
    tf.keras.layers.Rescaling(1./255),
    
    # Conv Block 1
    tf.keras.layers.Conv2D(32, 3, padding="same", use_bias=False, 
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("relu"),
    tf.keras.layers.MaxPooling2D(),
    
    # Conv Block 2
    tf.keras.layers.Conv2D(64, 3, padding="same", use_bias=False, 
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("relu"),
    tf.keras.layers.MaxPooling2D(),
    
    # Conv Block 3
    tf.keras.layers.Conv2D(128, 3, padding="same", use_bias=False, 
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("relu"),
    tf.keras.layers.MaxPooling2D(),
    
    # Conv Block 4
    tf.keras.layers.Conv2D(256, 3, padding="same", use_bias=False, 
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("relu"),
    tf.keras.layers.MaxPooling2D(),
    
    # Conv Block 5
    tf.keras.layers.Conv2D(512, 3, padding="same", use_bias=False, 
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("relu"),
    tf.keras.layers.MaxPooling2D(),
    
    tf.keras.layers.Flatten(),
    
    # Dense Block (The Classifier)
    # Note: We stick to 1-2 dense layers for CNNs to avoid parameter explosion
    tf.keras.layers.Dense(512, use_bias=False, 
                          kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("relu"),
    
    tf.keras.layers.Dropout(0.5),
    
    tf.keras.layers.Dense(num_classes)
])

# --- 3. COMPILE AND TRAIN ---
model.compile(
    optimizer="adam",
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=["accuracy"]
)

epochs = 100
history = model.fit(
    training_ds,
    validation_data=validation_ds,
    epochs=epochs,
    callbacks=my_callbacks
)

# --- 4. PLOT RESULTS ---
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']
loss = history.history['loss']
val_loss = history.history['val_loss']

actual_epochs = len(acc)
epochs_range = range(actual_epochs)

plt.figure(figsize=(12,6))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title(f'Accuracy ({actual_epochs} epochs)')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title(f'Loss ({actual_epochs} epochs)')
plt.show()
```
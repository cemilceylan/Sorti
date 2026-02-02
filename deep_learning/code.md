# Sorti: Run 6 (High Resolution Experiment)

This code block implements the "High Resolution" architecture (256x256), utilizing ELU activation, He Normal initialization, and adhering to the professor's strict monitoring methodology (using a named metric for EarlyStopping instead of total loss).

## Usage
Copy this entire block into a single cell in your Google Colab or Jupyter Notebook.

```python
# --- 0. PRE-REQUISITE: RELOAD DATA (256x256) ---
# IMPORTANT: Run this *before* building the model to ensure shapes match!
img_height = 256
img_width = 256
batch_size = 16 # Reduced to 16 to prevent OOM on T4 GPU

training_ds = tf.keras.utils.image_dataset_from_directory(
    directory,
    validation_split = 0.2,
    subset = "training",
    seed=123,
    image_size = (img_height, img_width),
    batch_size = batch_size
)

validation_ds = tf.keras.utils.image_dataset_from_directory(
    directory,
    validation_split = 0.2,
    subset = "validation",
    seed=123,
    image_size = (img_height, img_width),
    batch_size = batch_size
)

# Apply performance optimization
AUTOTUNE = tf.data.AUTOTUNE
training_ds = training_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
validation_ds = validation_ds.cache().prefetch(buffer_size=AUTOTUNE)


# --- 1. SETUP CALLBACKS (PROFESSOR'S LOGIC, CORRECTED FOR MULTI-CLASS) ---
import datetime

log_dir = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1)

# We monitor 'val_scc_metric' (Pure Multi-Class Error) instead of 'val_loss'.
# This ensures we stop based on predictive accuracy, following the professor's logic correctly.
early_stopping_callback = tf.keras.callbacks.EarlyStopping(
    monitor='val_scc_metric', 
    patience=15, 
    restore_best_weights=True
)

my_callbacks = [tensorboard_callback, early_stopping_callback]


# --- 2. DEFINE MODEL (256x256 High-Res + ELU + He Normal) ---
num_classes = len(class_names)

model = tf.keras.Sequential([
    # Explicit Input Layer to guarantee shape correctness
    tf.keras.layers.InputLayer(input_shape=(256, 256, 3)),
    
    # Augmentation
    data_augmentation,
    tf.keras.layers.Rescaling(1./255),
    
    # Conv Block 1
    tf.keras.layers.Conv2D(32, 3, padding="same", use_bias=False, 
                           kernel_initializer='he_normal',
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),
    
    # Conv Block 2
    tf.keras.layers.Conv2D(64, 3, padding="same", use_bias=False, 
                           kernel_initializer='he_normal',
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),
    
    # Conv Block 3
    tf.keras.layers.Conv2D(128, 3, padding="same", use_bias=False, 
                           kernel_initializer='he_normal',
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),
    
    # Conv Block 4
    tf.keras.layers.Conv2D(256, 3, padding="same", use_bias=False, 
                           kernel_initializer='he_normal',
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),
    
    # Conv Block 5 (High Capacity for complex textures)
    tf.keras.layers.Conv2D(512, 3, padding="same", use_bias=False, 
                           kernel_initializer='he_normal',
                           kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    tf.keras.layers.MaxPooling2D(),
    
    # Flatten (~32k neurons)
    tf.keras.layers.Flatten(),
    
    # Dense Block
    tf.keras.layers.Dense(512, use_bias=False, 
                          kernel_initializer='he_normal',
                          kernel_regularizer=tf.keras.regularizers.l2(0.001)),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Activation("elu"),
    
    # Dropout to combat the massive parameter count
    tf.keras.layers.Dropout(0.5),
    
    # Output Layer
    tf.keras.layers.Dense(num_classes)
])


# --- 3. COMPILE ---
model.compile(
    optimizer="adam",
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=[
        "accuracy",
        # Use SparseCategoricalCrossentropy metric named 'scc_metric'
        # This is the correct term for our 9-class problem.
        tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True, name='scc_metric')
    ]
)

# Print summary to verify parameter count before training
model.summary()

# --- 4. TRAIN ---
epochs = 100
history = model.fit(
    training_ds,
    validation_data=validation_ds,
    epochs=epochs,
    callbacks=my_callbacks
)

# --- 5. SAVE MODEL ---
# Note: Because early_stopping_callback had restore_best_weights=True, 
# 'model' now contains the weights from the BEST epoch, not necessarily the last one.
model_filename = 'sorti_run6_best.keras'
model.save(model_filename)
print(f"✅ Model saved successfully as {model_filename}")
```

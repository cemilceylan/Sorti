import * as tf from '@tensorflow/tfjs';

const MODEL_URL = '/models/model.json';
const CLASSES = ['battery', 'biological', 'cardboard', 'clothes', 'glass', 'metal', 'paper', 'plastic', 'shoes'];

// Define custom layers to handle Keras preprocessing layers not needed for inference
class RandomFlip extends tf.layers.Layer {
  static className = 'RandomFlip';
  constructor(config?: any) { super(config); }
  computeOutputShape(inputShape: tf.Shape | tf.Shape[]): tf.Shape | tf.Shape[] { return inputShape; }
  call(input: tf.Tensor | tf.Tensor[]): tf.Tensor | tf.Tensor[] { return input; }
}

class RandomRotation extends tf.layers.Layer {
  static className = 'RandomRotation';
  constructor(config?: any) { super(config); }
  computeOutputShape(inputShape: tf.Shape | tf.Shape[]): tf.Shape | tf.Shape[] { return inputShape; }
  call(input: tf.Tensor | tf.Tensor[]): tf.Tensor | tf.Tensor[] { return input; }
}

class RandomZoom extends tf.layers.Layer {
  static className = 'RandomZoom';
  constructor(config?: any) { super(config); }
  computeOutputShape(inputShape: tf.Shape | tf.Shape[]): tf.Shape | tf.Shape[] { return inputShape; }
  call(input: tf.Tensor | tf.Tensor[]): tf.Tensor | tf.Tensor[] { return input; }
}

// Register the custom layers
tf.serialization.registerClass(RandomFlip);
tf.serialization.registerClass(RandomRotation);
tf.serialization.registerClass(RandomZoom);

let model: tf.LayersModel | null = null;

export async function loadModel() {
  if (!model) {
    try {
      // 1. Fetch the model JSON manually
      const response = await fetch(MODEL_URL);
      const text = await response.text();

      // 2. Patch 'batch_shape' issue (replace with 'batch_input_shape')
      const patchedText = text.replace(/"batch_shape":/g, '"batch_input_shape":');

      // 3. Parse to fix relative paths for weights
      const modelJSON = JSON.parse(patchedText);
      
      // Get the base path (e.g., "/models/")
      const lastSlash = MODEL_URL.lastIndexOf('/');
      const basePath = lastSlash >= 0 ? MODEL_URL.substring(0, lastSlash + 1) : '';
      const fullBasePath = window.location.origin + basePath;

      // 4. Create a Blob URL from the patched JSON
      const blob = new Blob([JSON.stringify(modelJSON)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // 5. Load the model from the Blob URL
      // explicit weightPathPrefix to avoid relative path resolution against the blob: URL
      model = await tf.loadLayersModel(url, { weightPathPrefix: fullBasePath });
      console.log("Model loaded successfully");
      
      // Clean up the object URL
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to load model:", error);
      throw error;
    }
  }
  return model;
}

export async function classifyImage(imageElement: HTMLImageElement | HTMLVideoElement): Promise<{ className: string; probability: number }> {
  await loadModel();
  if (!model) throw new Error("Model not loaded");

  return tf.tidy(() => {
    // 1. Convert to tensor and resize
    const tensor = tf.browser.fromPixels(imageElement)
      .resizeNearestNeighbor([128, 128]) // Resize to model input shape
      .toFloat();

    // 2. Expand dimensions to (1, 128, 128, 3)
    const input = tensor.expandDims(0);

    // 3. Predict
    const predictions = model!.predict(input) as tf.Tensor;
    
    // Apply softmax to convert logits to probabilities
    const probabilities = predictions.softmax();

    // 4. Get results
    const data = probabilities.dataSync();
    const maxIndex = probabilities.argMax(-1).dataSync()[0];
    
    return {
      className: CLASSES[maxIndex],
      probability: data[maxIndex]
    };
  });
}
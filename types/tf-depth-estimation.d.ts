// TypeScript declaration for @tensorflow-models/depth-estimation
// This is a minimal stub to avoid import errors

declare module '@tensorflow-models/depth-estimation' {
  import * as tf from '@tensorflow/tfjs';
  export type SupportedModels = 'depth_midas' | 'depth_midas_v2' | 'depth_midas_v2_small' | 'depth_lite_rn50_keras';
  export interface DepthEstimationOptions {
    modelUrl?: string;
    modelName?: SupportedModels;
    inputSize?: number;
  }
  export interface DepthEstimator {
    estimateDepth(
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | ImageData,
      config?: { flipHorizontal?: boolean }
    ): Promise<tf.Tensor2D>;
  }
  export function load(options?: DepthEstimationOptions): Promise<DepthEstimator>;
}

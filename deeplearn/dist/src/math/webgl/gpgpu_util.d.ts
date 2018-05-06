export declare function getWebGLContextAttributes(): WebGLContextAttributes;
export declare function createWebGLContext(canvas?: HTMLCanvasElement): WebGLRenderingContext;
export declare function createVertexShader(gl: WebGLRenderingContext): WebGLShader;
export declare function createVertexBuffer(gl: WebGLRenderingContext): WebGLBuffer;
export declare function createIndexBuffer(gl: WebGLRenderingContext): WebGLBuffer;
export declare function createMatrixTexture(gl: WebGLRenderingContext, rows: number, columns: number): WebGLTexture;
export declare function createColorMatrixTexture(gl: WebGLRenderingContext, rows: number, columns: number): WebGLTexture;
export declare function createPackedMatrixTexture(gl: WebGLRenderingContext, rows: number, columns: number): WebGLTexture;
export declare function bindVertexProgramAttributeStreams(gl: WebGLRenderingContext, program: WebGLProgram, vertexBuffer: WebGLBuffer): void;
export declare function uploadPixelDataToTexture(gl: WebGLRenderingContext, texture: WebGLTexture, pixels: ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): void;
export declare function uploadMatrixToTexture(gl: WebGLRenderingContext, texture: WebGLTexture, rows: number, columns: number, matrix: Float32Array, numChannels: number): void;
export declare function uploadMatrixToPackedTexture(gl: WebGLRenderingContext, texture: WebGLTexture, rows: number, columns: number, matrix: Float32Array): void;
export declare function downloadMatrixFromOutputTexture(gl: WebGLRenderingContext, rows: number, columns: number): Float32Array;
export declare function downloadMatrixFromPackedOutputTexture(gl: WebGLRenderingContext, rows: number, columns: number): Float32Array;

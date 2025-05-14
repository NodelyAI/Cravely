// Global TypeScript type augmentations

// Add TextEncoder and TextDecoder types to NodeJS global namespace
interface TextEncoder {
  encode(input?: string): Uint8Array;
}

interface TextDecoder {
  decode(input?: ArrayBuffer | ArrayBufferView | null): string;
}

// Add global declarations
declare global {
  var TextEncoder: {
    new (): TextEncoder;
    prototype: TextEncoder;
  };
  
  var TextDecoder: {
    new (label?: string, options?: TextDecoderOptions): TextDecoder;
    prototype: TextDecoder;
  };
  
  interface TextDecoderOptions {
    fatal?: boolean;
    ignoreBOM?: boolean;
  }
}

export {};

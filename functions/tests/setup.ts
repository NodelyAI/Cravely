// This file is used for Jest setup
import { TextEncoder, TextDecoder } from 'util';

// Set up global TextEncoder/TextDecoder
// Use type assertion to avoid TypeScript errors with incompatible interfaces
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

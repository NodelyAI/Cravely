"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This file is used for Jest setup
const util_1 = require("util");
// Set up global TextEncoder/TextDecoder
// Use type assertion to avoid TypeScript errors with incompatible interfaces
global.TextEncoder = util_1.TextEncoder;
global.TextDecoder = util_1.TextDecoder;
//# sourceMappingURL=setup.js.map
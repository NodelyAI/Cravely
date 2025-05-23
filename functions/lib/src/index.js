"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicMenuQRGenerator = exports.realQRGenerator = void 0;
const admin = __importStar(require("firebase-admin"));
const enhancedQRCodeGenerator_1 = require("./enhancedQRCodeGenerator");
Object.defineProperty(exports, "realQRGenerator", { enumerable: true, get: function () { return enhancedQRCodeGenerator_1.realQRGenerator; } });
const publicMenuQRGenerator_1 = require("./publicMenuQRGenerator");
Object.defineProperty(exports, "publicMenuQRGenerator", { enumerable: true, get: function () { return publicMenuQRGenerator_1.publicMenuQRGenerator; } });
// Initialize Firebase Admin SDK
try {
    // Check if admin has already been initialized
    if (admin.apps.length === 0) {
        admin.initializeApp({
            // Use default credentials (will use service account in production,
            // or environment variables locally)
            credential: admin.credential.applicationDefault(),
            storageBucket: 'cravely-f2914.appspot.com' // Explicitly set the storage bucket
        });
        console.log('Firebase Admin SDK initialized successfully');
    }
    else {
        console.log('Firebase Admin SDK already initialized');
    }
}
catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
}
//# sourceMappingURL=index.js.map
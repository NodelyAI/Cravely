import * as admin from 'firebase-admin';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as functions from 'firebase-functions';
import { generateTableQRCodes } from './generateTableQRCodes';
import { generateTableQRCodesHttp } from './generateTableQRCodesHttp';
import { generateTableQRCodesHttpMock } from './generateTableQRCodesHttpMock';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export functions
export { generateTableQRCodes, generateTableQRCodesHttp, generateTableQRCodesHttpMock };

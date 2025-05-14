# Technical Implementation Details

This document provides in-depth technical information about the Cravely backend implementation for developers working on the codebase.

## Cloud Function: `generateTableQRCodes`

### Implementation Details

The function handles table creation and QR code generation through these steps:

1. **Input Validation:** Checks that `restaurantId` and `tableLabels` are provided in the correct format
2. **Document Creation:** Creates Firestore documents for each table with a unique ID
3. **QR Generation:** Uses the `qrcode` npm package to create PNG images with error correction
4. **Storage Upload:** Saves images to Firebase Storage with appropriate metadata
5. **URL Generation:** Creates signed URLs for long-term access to the QR images
6. **Document Update:** Updates the table documents with the QR URL references

### Key Code Sections

```typescript
// Generate QR code
const tempFilePath = path.join(os.tmpdir(), `${tableId}.png`);
await QRCode.toFile(tempFilePath, deepLinkUrl, {
  errorCorrectionLevel: "H",
  margin: 4,
  width: 512,
  color: {
    dark: "#000000",
    light: "#FFFFFF",
  },
});

// Upload to Firebase Storage
const storageFilePath = `qrcodes/${restaurantId}/${tableId}.png`;
await bucket.upload(tempFilePath, {
  destination: storageFilePath,
  metadata: {
    contentType: "image/png",
    cacheControl: "public, max-age=31536000",
  },
});
```

### Error Handling

The function uses a try/catch pattern to handle errors and provide meaningful error responses:

```typescript
try {
  // Function implementation
} catch (error) {
  console.error("Error generating QR codes:", error);
  throw new functions.https.HttpsError(
    "internal",
    "Failed to generate QR codes",
    error
  );
}
```

## Firestore Security Rules

### Rule Structure

The security rules implement a granular permission system:

1. **Default Denial:** All access is denied by default for security
2. **Public Reads:** Restaurant, menu, and table data are publicly readable
3. **Authenticated Writes:** Restaurant staff can update their own restaurant data
4. **Guest Operations:** Unauthenticated users can create orders and requests

### Implementation Details

```
match /orders/{orderId} {
  allow create: if true; // Allow guests to create orders
  allow read: if true; // Allow guests to read their own orders

  // Allow restaurant staff to update orders
  allow update: if request.auth != null &&
                 request.auth.token.restaurantId == resource.data.restaurantId;

  // Disallow delete for everyone
  allow delete: if false;
}
```

## Guest Ordering Page

### Component Structure

The ordering page uses React hooks for state management:

1. **Data Fetching:** Retrieves restaurant, table, and menu data from Firestore
2. **Cart Management:** Handles adding, customizing, and removing items
3. **Order Submission:** Creates new order documents in Firestore
4. **Staff Requests:** Manages bill and assistance request creation

### Key State Management

```typescript
// State hooks for order management
const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
const [cart, setCart] = useState<CartItem[]>([]);
const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
  {}
);
```

### Order Submission Logic

```typescript
// Create order in Firestore
const orderRef = await addDoc(collection(db, "orders"), {
  restaurantId,
  tableId,
  items: cart.map((item) => ({
    menuItemId: item.menuItemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    options: item.options,
    specialInstructions: item.specialInstructions,
  })),
  total: cartTotal,
  status: "pending",
  createdAt: serverTimestamp(),
});
```

## AI Integration

### Context-Aware AI

The AI service has been enhanced to use context for better recommendations:

1. **Context Collection:** Gathers table ID, restaurant data, and order history
2. **Context Formatting:** Structures the data for optimal AI processing
3. **Context-Aware Caching:** Uses context as part of the cache key to avoid duplication
4. **Enhanced Prompts:** Builds comprehensive prompts with relevant contextual data

### Implementation Details

```typescript
// Create a cache key that includes context if available
const cacheKey = context ? `${prompt}-${JSON.stringify(context)}` : prompt;

// Enhance the prompt with context
let enhancedPrompt = prompt;
if (context) {
  // Format context information for the AI
  const contextParts = [];

  if (context.tableId) {
    contextParts.push(`Table ID: ${context.tableId}`);
  }

  // Add additional context elements...

  if (contextParts.length > 0) {
    enhancedPrompt = `Context:\n${contextParts.join(
      "\n"
    )}\n\nUser Query: ${prompt}`;
  }
}
```

## Testing Infrastructure

### Cloud Function Tests

Tests use the Firebase Functions Test SDK and Jest:

1. **Mocking:** Mock Firestore, Storage, and file operations
2. **Validation Testing:** Verify input validation works correctly
3. **Success Testing:** Ensure table documents and QR codes are created properly

### Guest Ordering Tests

Integration tests for the guest order flow:

1. **Rendering:** Verify components render with correct data
2. **Interaction:** Test adding items to cart and customization
3. **Submission:** Validate order creation in Firestore
4. **Staff Requests:** Test bill and assistance request functions

## Performance Considerations

1. **Caching:** AI responses are cached to minimize API calls
2. **Optimized Queries:** Firestore queries use appropriate indexes
3. **Lazy Loading:** Menu items and images load progressively
4. **Debouncing:** User inputs are debounced to prevent excessive service calls

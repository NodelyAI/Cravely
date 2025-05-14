# Cravely Backend Implementation Guide

This guide explains how to deploy and test the backend components for the Cravely restaurant ordering system, which enables QR code-based table ordering and AI-powered recommendations.

## Components Implemented

1. **Cloud Function (`generateTableQRCodes`)**: Creates Firestore documents for tables and generates QR codes with unique deep links
2. **Firestore Security Rules**: Secures data while allowing authenticated restaurant staff access and guest ordering
3. **Guest Ordering Page**: Provides an interface for customers to browse menus, place orders, and request assistance
4. **AI Integration**: Delivers contextual AI recommendations based on order history and customer preferences

## Technical Architecture

### Data Structure

```
firestore/
├── restaurants/{restaurantId}  # Restaurant details
├── tables/{tableId}            # Table information with QR URLs
├── menuItems/{itemId}          # Menu items with categories and options
├── orders/{orderId}            # Customer orders with items and status
├── billRequests/{requestId}    # Bill payment requests
└── assistanceRequests/{requestId}  # Staff assistance requests
```

### Storage Structure

```
storage/
└── qrcodes/{restaurantId}/{tableId}.png  # Generated QR code images
```

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Firebase project with Firestore, Storage, and Functions enabled
- Firebase CLI installed globally

### Firebase Setup

1. **Install Firebase CLI** (if not already installed):

   ```powershell
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```powershell
   firebase login
   ```

3. **Initialize Firebase in the project**:

   ```powershell
   cd f:\Cravely\cravely_app
   firebase init
   ```

   - Select Firestore, Functions, and Storage
   - Choose your Firebase project
   - Accept defaults for other options

4. **Deploy Firestore Security Rules**:

   ```powershell
   firebase deploy --only firestore:rules
   ```

5. **Install Functions Dependencies and Deploy**:
   ```powershell
   cd f:\Cravely\cravely_app\functions
   npm install
   npm run build
   npm run deploy
   ```

### Testing

#### Cloud Functions Testing

1. **Run Cloud Function tests**:

   ```powershell
   cd f:\Cravely\cravely_app\functions
   npm test
   ```

   This will execute Jest tests for the `generateTableQRCodes` function to verify:

   - Table documents are created correctly
   - QR codes are generated with proper deep links
   - Storage uploads work as expected
   - Error handling functions properly

#### Local Emulator Testing

1. **Start Firebase emulators**:

   ```powershell
   cd f:\Cravely\cravely_app
   firebase emulators:start
   ```

2. **Run the application in development mode**:

   ```powershell
   npm run dev
   ```

3. **Test the QR code generation** in your browser or with the Firebase console.

4. **Test guest ordering workflow**:
   - Visit `/r/{restaurantId}/t/{tableId}` in your browser
   - Browse menu categories and items
   - Customize items and add to cart
   - Place an order and verify it appears in Firestore
   - Test bill request and server assistance features
   - Interact with the AI recommendation system

## API Reference

### Cloud Functions

#### `generateTableQRCodes`

Generates QR codes for multiple tables in a restaurant.

**Parameters:**

```typescript
{
  restaurantId: string;     // ID of the restaurant
  tableLabels: string[];    // Array of labels for tables (e.g., "Table 1", "Bar 3")
}
```

**Returns:**

```typescript
{
  success: boolean;         // Whether the operation was successful
  tables: {                 // Object with table IDs as keys
    [tableId: string]: string;  // QR code download URL for each table
  }
}
```

**Example usage in frontend:**

```typescript
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions();
const generateQRCodes = httpsCallable(functions, "generateTableQRCodes");

// Generate QR codes for three tables
generateQRCodes({
  restaurantId: "rest123",
  tableLabels: ["Table 1", "Table 2", "Bar 1"],
})
  .then((result) => {
    const { success, tables } = result.data;
    if (success) {
      // tables = { "table1Id": "https://storage.url/qrcode1.png", ... }
      console.log("QR codes generated successfully:", tables);
    }
  })
  .catch((error) => {
    console.error("Error generating QR codes:", error);
  });
```

### AI Integration

The AI service is integrated into the guest ordering experience to provide personalized recommendations:

**AIChat Component Props:**

```typescript
interface AIChatProps {
  context?: AIContext;
}

type AIContext = {
  tableId?: string; // Current table ID
  restaurantId?: string; // Current restaurant ID
  lastOrders?: Array<any>; // Previous orders from this table
  userPreferences?: Record<string, any>; // User preferences data
};
```

**Example usage in guest ordering page:**

```tsx
// In table order page
<AIChat
  context={{
    tableId,
    restaurantId,
    lastOrders,
  }}
/>
```

## User Workflows

### Restaurant Staff

1. **Table Management:**

   - Access the restaurant dashboard ("/dashboard/tables")
   - Add tables with descriptive labels (e.g., "Table 5", "Patio 2")
   - Generate QR codes using the Cloud Function
   - Download, print, and place QR codes on tables

2. **Order Management:**
   - View incoming orders in real-time on the dashboard
   - See order details including items, customizations, and table information
   - Update order status (pending → preparing → ready → delivered → completed)
   - Respond to assistance requests and bill payment requests

### Guests

1. **Ordering Process:**

   - Scan QR code with smartphone camera
   - Browse menu by category with visual indicators for dietary preferences
   - Select items to view details and customize as needed
   - Add items to cart and specify quantity
   - Review order in cart drawer
   - Place order and receive confirmation
   - Request bill or server assistance with dedicated buttons

2. **AI Recommendations:**
   - Access AI chat assistant from the ordering page
   - Ask about menu items, dietary information, popular choices
   - Receive personalized recommendations based on order history
   - Get assistance with special requests or menu explanations

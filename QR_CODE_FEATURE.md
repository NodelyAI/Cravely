# QR Code Feature for Restaurant Tables

This feature allows restaurants to generate QR codes for their tables, which customers can scan to access the menu, place orders, and request assistance.

## Components

### For Restaurant Owners/Admins

1. **TablesPage** (`src/pages/TablesPage.tsx`)

   - Allows restaurant admins to generate QR codes for tables
   - Displays existing tables with their QR codes
   - Enables downloading QR codes for printing

2. **OrdersPage** (`src/pages/OrdersPage.tsx`)
   - Real-time tracking of customer orders
   - Ability to update order status (Pending, Preparing, Ready, Served, Cancelled)
   - Notifications for new orders with sound alerts

### For Customers

1. **TableOrderPage** (`src/pages/r/[restaurantId]/t/[tableId].tsx`)
   - Menu display with categories and item details
   - Item customization options
   - Cart functionality for ordering
   - Order placement with confirmation
   - Bill and assistance request buttons

## Getting Started

### For Restaurant Admins

1. Navigate to the Tables page to generate QR codes for your tables
2. Enter table labels (e.g., "Table 1", "Bar 3") and generate QR codes
3. Download and print the QR codes, then place them on your tables
4. When customers scan the QR codes, they can browse the menu and place orders
5. Track and manage incoming orders in real-time on the Orders page

### For Customers

1. Scan the QR code on your table using your phone's camera
2. Browse the menu, select items, and customize as needed
3. Add items to your cart and place your order
4. Use the "Call server" button if you need assistance
5. Use the "Request bill" button when you're ready to pay

## How It Works

1. The QR codes contain a deep link to a specific table page (e.g., `https://cravely.app/r/{restaurantId}/t/{tableId}`)
2. When a customer scans the code, they're directed to the table-specific ordering page
3. Orders are stored in Firestore with real-time updates to the restaurant's dashboard
4. Restaurant staff receive notifications for new orders and can update status as they're processed

## Cloud Functions

The system uses Firebase Cloud Functions to generate QR codes:

- `generateTableQRCodes`: Creates QR codes for tables and stores them in Firebase Storage
- Entries for each table are created in Firestore with reference to the QR image

## Technologies Used

- React for the UI components
- Firebase/Firestore for real-time data storage and synchronization
- Firebase Cloud Functions for QR code generation
- Firebase Storage for storing QR code images

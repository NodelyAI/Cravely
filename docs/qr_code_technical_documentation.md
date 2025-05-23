# QR Code Feature - Technical Documentation

## Overview

The QR code feature allows restaurant owners to generate unique QR codes for each table in their establishment. Customers can scan these QR codes to access a digital menu, place orders, and request service, all without requiring staff intervention. This document outlines the technical implementation of this feature.

## Architecture

### Frontend Components

1. **TablesPage** (`src/pages/TablesPage.tsx`)

   - UI for restaurant admins to manage tables and generate QR codes
   - Allows downloading QR codes as PNG files for printing
   - Displays existing tables with their assigned QR codes

2. **TableOrderPage** (`src/pages/r/[restaurantId]/t/[tableId].tsx`)

   - Customer-facing page accessed when scanning a QR code
   - Displays restaurant menu with categories and item details
   - Handles item customization and cart functionality
   - Processes order submission to Firestore

3. **OrdersPage** (`src/pages/OrdersPage.tsx`)

   - Real-time order management dashboard for restaurant staff
   - Displays incoming orders with status controls
   - Includes notification system for new orders

4. **OrderNotifications** (`src/components/features/OrderNotifications.tsx`)
   - Handles visual and audio notifications for new orders
   - Integrates with the browser's notification API

### Backend Services

1. **Cloud Function: generateTableQRCodes**

   - Generates QR code images for tables on demand
   - Creates entries in Firestore tables collection
   - Uploads QR images to Firebase Storage
   - Returns links to the generated images

2. **Firebase Firestore Collections**

   - `restaurants`: Restaurant information
   - `tables`: Table data including QR code URLs
   - `menuItems`: Restaurant menu items
   - `orders`: Customer orders with status tracking
   - `billRequests`: Requests for bill from customers
   - `assistanceRequests`: Requests for server assistance

3. **Firebase Storage**

   - Stores generated QR code images
   - Provides public URLs for accessing QR codes

4. **Service Worker**
   - Handles browser notifications for new orders
   - Provides background notification capability

## Data Flow

1. **QR Code Generation**

   ```
   Admin UI → Cloud Function → Firestore + Storage → QR Code URL → Admin UI
   ```

2. **Customer Order Flow**

   ```
   Scan QR → TableOrderPage → View Menu → Add Items to Cart → Submit Order → Firestore
   ```

3. **Order Notification Flow**
   ```
   New Order in Firestore → OrdersPage Listener → Display Notification → Admin UI
   ```

## Security Considerations

- QR codes use dynamic URLs linked to specific restaurant and table IDs
- Firestore security rules ensure:
  - Only authenticated restaurant admins can generate QR codes
  - Customers can only view menu items for the scanned restaurant
  - Customers can only place orders for their current table
  - Only restaurant staff can update order status

## Implementation Notes

- The QR codes contain a direct URL to the table-specific ordering page
- Real-time updates use Firestore listeners for immediate order notifications
- The notification system works both when the browser tab is active and in the background
- Order status updates are synchronized in real-time between the kitchen/staff view and the customer view

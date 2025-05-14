// Script to set up Firestore collections for Cravely app
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check for service account file
let serviceAccount;
try {
  // Path to your service account key file
  serviceAccount = require('./service-account-key.json');
} catch (error) {
  console.error('Error loading service account key. Make sure you have a service-account-key.json file in this directory.');
  console.error('You can download it from Firebase Console > Project Settings > Service Accounts > Generate new private key');
  console.error('Error details:', error.message);
  process.exit(1);
}

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${serviceAccount.project_id}.appspot.com`
  });
  
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
  process.exit(1);
}

// Make a backup of the original bucket reference
const originalBucket = admin.storage().bucket();

// Create a reference to the proper storage bucket format
const bucket = admin.storage().bucket(`${serviceAccount.project_id}.firebasestorage.app`);

const db = admin.firestore();

// Demo data for collections
const demoData = {
  restaurants: [
    {
      name: 'Demo Restaurant',
      owner: 'demo-user-id', // This should be replaced with actual user ID
      address: '123 Demo Street, City, Country',
      phone: '+1 (555) 123-4567',
      openingHours: '9:00 AM - 10:00 PM',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ],
  menuCategories: [
    {
      name: 'Appetizers',
      restaurantId: '', // Will be populated
      order: 1
    },
    {
      name: 'Main Courses',
      restaurantId: '', // Will be populated
      order: 2
    },
    {
      name: 'Desserts',
      restaurantId: '', // Will be populated
      order: 3
    },
    {
      name: 'Drinks',
      restaurantId: '', // Will be populated
      order: 4
    }
  ],
  menuItems: [
    {
      name: 'Spring Rolls',
      description: 'Fresh vegetables wrapped in thin pastry, deep-fried until crispy.',
      price: 7.99,
      category: 'Appetizers',
      restaurantId: '', // Will be populated
      available: true,
      image: 'menu-items/spring-rolls.jpg' // Path in Storage
    },
    {
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce with Caesar dressing, parmesan, and croutons.',
      price: 9.99,
      category: 'Appetizers',
      restaurantId: '', // Will be populated
      available: true,
      image: 'menu-items/caesar-salad.jpg'
    },
    {
      name: 'Grilled Salmon',
      description: 'Atlantic salmon fillet, grilled to perfection, served with seasonal vegetables.',
      price: 22.99,
      category: 'Main Courses',
      restaurantId: '', // Will be populated
      available: true,
      image: 'menu-items/grilled-salmon.jpg'
    },
    {
      name: 'Vegetable Stir Fry',
      description: 'Mixed vegetables stir-fried in a savory sauce with steamed rice.',
      price: 15.99,
      category: 'Main Courses',
      restaurantId: '', // Will be populated
      available: true,
      image: 'menu-items/vegetable-stir-fry.jpg'
    },
    {
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream.',
      price: 8.99,
      category: 'Desserts',
      restaurantId: '', // Will be populated
      available: true,
      image: 'menu-items/chocolate-lava-cake.jpg'
    },
    {
      name: 'Fresh Fruit Sorbet',
      description: 'Seasonal fruit sorbet, light and refreshing.',
      price: 6.99,
      category: 'Desserts',
      restaurantId: '', // Will be populated
      available: true,
      image: 'menu-items/fruit-sorbet.jpg'
    },
    {
      name: 'Iced Tea',
      description: 'Freshly brewed black tea, served cold with lemon and mint.',
      price: 3.99,
      category: 'Drinks',
      restaurantId: '', // Will be populated
      available: true,
      image: 'menu-items/iced-tea.jpg'
    },
    {
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice.',
      price: 4.99,
      category: 'Drinks',
      restaurantId: '', // Will be populated
      available: true,
      image: 'menu-items/orange-juice.jpg'
    }
  ],
  tables: [
    {
      label: 'Table 1',
      restaurantId: '', // Will be populated
      qrUrl: '', // Will be generated and updated
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      label: 'Table 2',
      restaurantId: '', // Will be populated
      qrUrl: '', // Will be generated and updated
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      label: 'Table 3',
      restaurantId: '', // Will be populated
      qrUrl: '', // Will be generated and updated
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      label: 'Bar 1',
      restaurantId: '', // Will be populated
      qrUrl: '', // Will be generated and updated
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ]
};

// Sample images to upload to Storage
// Use path.join to create absolute paths based on script directory
const SCRIPT_DIR = __dirname;
const sampleImages = [
  {
    localPath: path.join(SCRIPT_DIR, 'sample-images', 'spring-rolls.jpg'),
    storagePath: 'menu-items/spring-rolls.jpg',
    contentType: 'image/jpeg'
  },
  {
    localPath: path.join(SCRIPT_DIR, 'sample-images', 'caesar-salad.jpg'),
    storagePath: 'menu-items/caesar-salad.jpg',
    contentType: 'image/jpeg'
  },
  {
    localPath: path.join(SCRIPT_DIR, 'sample-images', 'grilled-salmon.jpg'),
    storagePath: 'menu-items/grilled-salmon.jpg',
    contentType: 'image/jpeg'
  },
  {
    localPath: path.join(SCRIPT_DIR, 'sample-images', 'vegetable-stir-fry.jpg'),
    storagePath: 'menu-items/vegetable-stir-fry.jpg',
    contentType: 'image/jpeg'
  },
  {
    localPath: path.join(SCRIPT_DIR, 'sample-images', 'chocolate-lava-cake.jpg'),
    storagePath: 'menu-items/chocolate-lava-cake.jpg',
    contentType: 'image/jpeg'
  },
  {
    localPath: path.join(SCRIPT_DIR, 'sample-images', 'fruit-sorbet.jpg'),
    storagePath: 'menu-items/fruit-sorbet.jpg',
    contentType: 'image/jpeg'
  },
  {
    localPath: path.join(SCRIPT_DIR, 'sample-images', 'iced-tea.jpg'),
    storagePath: 'menu-items/iced-tea.jpg',
    contentType: 'image/jpeg'
  },
  {
    localPath: path.join(SCRIPT_DIR, 'sample-images', 'orange-juice.jpg'),
    storagePath: 'menu-items/orange-juice.jpg',
    contentType: 'image/jpeg'
  }
];

// Function to check if collection exists and is empty
async function isCollectionEmptyOrNonexistent(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).limit(1).get();
    return snapshot.empty;
  } catch (error) {
    console.error(`Error checking collection ${collectionName}:`, error);
    return true; // Assume empty/non-existent on error
  }
}

// Function to upload sample images to Storage
async function uploadSampleImages() {
  console.log('Uploading sample images to Firebase Storage...');
  
  try {
    // Try both bucket formats in sequence
    let successfulBucket = bucket;
    let bucketError = null;
    
    try {
      // Test if the first bucket format works
      await bucket.exists();
    } catch (error) {
      console.log('First bucket format not working, trying alternative format...');
      bucketError = error;
      
      // Try alternative bucket format: project-id.appspot.com
      try {
        const altBucket = admin.storage().bucket(`${serviceAccount.project_id}.appspot.com`);
        await altBucket.exists();
        // If we reach here, the alternative format works
        successfulBucket = altBucket;
        console.log('Using alternative bucket format.');
      } catch (altError) {
        console.error('Both bucket formats failed.', altError);
        console.log('Please check your Firebase project configuration and ensure Storage is enabled.');
        // Continue with the original bucket format anyway
      }
    }
    
    const imageUploadPromises = sampleImages.map(async (image) => {
      if (!fs.existsSync(image.localPath)) {
        console.warn(`Warning: Image file not found at ${image.localPath}`);
        return null;
      }
      
      try {
        await successfulBucket.upload(image.localPath, {
          destination: image.storagePath,
          metadata: {
            contentType: image.contentType,
            cacheControl: 'public, max-age=31536000' // Cache for 1 year
          }
        });
        
        console.log(`Uploaded: ${image.storagePath}`);
        
        // Make the file publicly accessible
        await successfulBucket.file(image.storagePath).makePublic();
        
        return image.storagePath;
      } catch (error) {
        console.error(`Error uploading ${image.localPath}:`, error.message);
        return null;
      }
    });
    
    await Promise.all(imageUploadPromises);
    console.log('Sample images uploaded successfully');
  } catch (error) {
    console.error('Error uploading sample images:', error);
  }
}

// Function to set up Firestore collections
async function setupFirestoreCollections() {
  console.log('Setting up Firestore collections...');
  
  try {
    // 1. Create a restaurant document
    let restaurantId;
    if (await isCollectionEmptyOrNonexistent('restaurants')) {
      const restaurantRef = await db.collection('restaurants').add(demoData.restaurants[0]);
      restaurantId = restaurantRef.id;
      console.log(`Created restaurant with ID: ${restaurantId}`);
    } else {
      const restaurantsSnapshot = await db.collection('restaurants').limit(1).get();
      restaurantId = restaurantsSnapshot.docs[0].id;
      console.log(`Using existing restaurant with ID: ${restaurantId}`);
    }
    
    // 2. Update all data with the restaurant ID
    demoData.menuCategories.forEach(category => {
      category.restaurantId = restaurantId;
    });
    
    demoData.menuItems.forEach(item => {
      item.restaurantId = restaurantId;
    });
    
    demoData.tables.forEach(table => {
      table.restaurantId = restaurantId;
    });
    
    // 3. Create menu categories
    if (await isCollectionEmptyOrNonexistent('menuCategories')) {
      const categoryPromises = demoData.menuCategories.map(async (category) => {
        await db.collection('menuCategories').add(category);
      });
      
      await Promise.all(categoryPromises);
      console.log('Menu categories created successfully');
    } else {
      console.log('Menu categories already exist, skipping...');
    }
    
    // 4. Create menu items
    if (await isCollectionEmptyOrNonexistent('menuItems')) {
      const menuItemPromises = demoData.menuItems.map(async (item) => {
        // Get public URL for the image
        try {
          const file = bucket.file(item.image);
          const [exists] = await file.exists();
          
          if (exists) {
            const [metadata] = await file.getMetadata();
            if (metadata && metadata.mediaLink) {
              item.imageUrl = metadata.mediaLink;
            }
          }
        } catch (error) {
          console.warn(`Warning: Could not get image URL for ${item.name}:`, error.message);
        }
        
        await db.collection('menuItems').add(item);
      });
      
      await Promise.all(menuItemPromises);
      console.log('Menu items created successfully');
    } else {
      console.log('Menu items already exist, skipping...');
    }
    
    // 5. Create tables
    if (await isCollectionEmptyOrNonexistent('tables')) {
      // We'll need to set up QR codes later through the Cloud Function
      const tablePromises = demoData.tables.map(async (table) => {
        await db.collection('tables').add(table);
      });
      
      await Promise.all(tablePromises);
      console.log('Tables created successfully');
    } else {
      console.log('Tables already exist, skipping...');
    }
    
    console.log('Firestore setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Firestore collections:', error);
  }
}

// Function to create sample-images directory if it doesn't exist
function ensureSampleImagesDirectory() {
  const dir = path.join(SCRIPT_DIR, 'sample-images');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log('Created sample-images directory');
    
    // Create a README file explaining how to add images
    const readmePath = path.join(dir, 'README.md');
    const readmeContent = `# Sample Images for Cravely

This directory is for sample menu item images that will be uploaded to Firebase Storage.

Please add your images here with the following names:
- spring-rolls.jpg
- caesar-salad.jpg
- grilled-salmon.jpg
- vegetable-stir-fry.jpg
- chocolate-lava-cake.jpg
- fruit-sorbet.jpg
- iced-tea.jpg
- orange-juice.jpg

If you don't have these specific images, you can use any food images but rename them to match these filenames.
`;
    
    fs.writeFileSync(readmePath, readmeContent);
    console.log('Created README in sample-images directory');
  }
}

// Main function to run the setup
async function main() {
  console.log('Starting Cravely Firebase setup...');
  
  try {
    // Ensure we have a directory for sample images
    ensureSampleImagesDirectory();
    
    // Upload sample images first
    await uploadSampleImages();
    
    // Set up Firestore collections
    await setupFirestoreCollections();
    
    console.log('\nSetup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. If you added sample images, they have been uploaded to Firebase Storage');
    console.log('2. Firestore collections have been populated with demo data');
    console.log('3. To generate QR codes for tables, go to the Tables page in the app and use the QR code generator');
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

// Run the setup
main().catch(console.error);

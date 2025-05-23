const fs = require('fs');
const path = require('path');

// Define source and destination directories
const srcDir = path.join(__dirname, 'lib', 'src');
const destDir = path.join(__dirname, 'lib');

// Create a recursive function to copy files
function copyFiles(source, destination) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // Get all files in source directory
  const files = fs.readdirSync(source);

  // Copy each file to destination
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    // If it's a directory, recursively copy it
    if (fs.statSync(sourcePath).isDirectory()) {
      copyFiles(sourcePath, destPath);
    } else {
      // Otherwise, just copy the file
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}

// Execute the file copying
copyFiles(srcDir, destDir);

console.log('Files copied successfully!');

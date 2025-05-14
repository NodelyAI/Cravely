# Firebase Emulator Setup
# This script starts the Firebase emulators for local development.

# Set the project directory
$projectDir = "f:\Cravely\cravely_app"

# Navigate to the project directory
Set-Location $projectDir

# Check if firebase-tools is installed globally
$firebaseInstalled = $null
try {
    $firebaseInstalled = Get-Command firebase -ErrorAction SilentlyContinue
} catch {
    # Firebase CLI not found
}

if ($null -eq $firebaseInstalled) {
    Write-Host "Firebase CLI not found. Installing firebase-tools globally..." -ForegroundColor Yellow
    npm install -g firebase-tools
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install firebase-tools. Please install it manually with 'npm install -g firebase-tools'" -ForegroundColor Red
        exit 1
    }
}

# Check if user is logged in to Firebase
firebase login:list
if ($LASTEXITCODE -ne 0) {
    Write-Host "You need to log in to Firebase first. Running firebase login..." -ForegroundColor Yellow
    firebase login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to log in to Firebase. Please run 'firebase login' manually." -ForegroundColor Red
        exit 1
    }
}

# Check if firebase.json exists, if not, initialize Firebase
if (-not (Test-Path -Path "$projectDir\firebase.json")) {
    Write-Host "Firebase not initialized in this project. Running firebase init..." -ForegroundColor Yellow
    
    # Create a temporary response file for the firebase init command
    $responseFile = "$env:TEMP\firebase-init-response.txt"
@"
y
n
Firestore: Configure a security rules file for Cloud Firestore
Functions: Configure a Cloud Functions directory and its files
Hosting: Configure files for Firebase Hosting
Storage: Configure a security rules file for Cloud Storage
Emulators: Set up local emulators for Firebase products
Use an existing project
cravely
JavaScript
n
y
y
y
functions
n
4000
n
8080
n
9099
n
5001
n
9199
n
y
"@ | Out-File -FilePath $responseFile
    
    Get-Content $responseFile | firebase init
    
    # Clean up the response file
    Remove-Item $responseFile
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to initialize Firebase. Please run 'firebase init' manually." -ForegroundColor Red
        exit 1
    }
}

# Build the Cloud Functions
Write-Host "Building Cloud Functions..." -ForegroundColor Cyan
Set-Location "$projectDir\functions"
npm install
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build Cloud Functions. Please check the errors above." -ForegroundColor Red
    Set-Location $projectDir
    exit 1
}

# Return to the project directory
Set-Location $projectDir

# Start the emulators
Write-Host "Starting Firebase emulators..." -ForegroundColor Green
firebase emulators:start --import=./emulator-data --export-on-exit=./emulator-data

# The script will wait here until the emulators are stopped

// Door Status Widget for Scriptable
// Shows whether the door is locked or unlocked with distinctive SVG icons

// Configuration
const URL = "https://www.fachschaft.informatik.uni-kl.de/opendoor.json"
const WIDGET_TITLE = "Door Status"
const REFRESH_INTERVAL_SECONDS = 300 // Update every 5 minutes
const DEBUG = false // Set to true for testing with random statuses

// SVG Icons (simplified for better recognition on small screens)
const DOOR_LOCKED_SVG = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="25" y="25" width="50" height="60" rx="5" fill="#e74c3c"/>
  <rect x="35" y="10" width="30" height="40" rx="5" fill="#e74c3c"/>
  <rect x="40" y="40" width="20" height="30" rx="2" fill="#fff"/>
  <circle cx="50" cy="55" r="7" fill="#444"/>
  <rect x="49" y="48" width="2" height="14" fill="#444"/>
</svg>
`

const DOOR_UNLOCKED_SVG = `
<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="25" y="25" width="50" height="60" rx="5" fill="#2ecc71"/>
  <rect x="35" y="10" width="30" height="40" rx="5" fill="#2ecc71" transform="rotate(-30, 50, 30)"/>
  <rect x="40" y="40" width="20" height="30" rx="2" fill="#fff"/>
  <circle cx="50" cy="55" r="7" fill="#444"/>
  <rect x="49" y="48" width="2" height="14" fill="#444"/>
</svg>
`

// Function to fetch door status
async function fetchDoorStatus() {
  try {
    if (DEBUG) {
      // For testing: randomly return true or false
      return Math.random() > 0.5
    }
    
    let req = new Request(URL)
    let res = await req.loadJSON()
    
    // According to the URL, opendoor: false means the door is locked
    // We return true if the door is OPEN (not locked)
    return res.opendoor === true
  } catch (error) {
    console.error(`Error fetching door status: ${error}`)
    return null
  }
}

// Create and return the widget
async function createWidget() {
  const widget = new ListWidget()
  
  // Add background gradient
  const gradient = new LinearGradient()
  gradient.colors = [new Color("#1c1c1e"), new Color("#2c2c2e")]
  gradient.locations = [0.0, 1.0]
  widget.backgroundGradient = gradient
  
  // Set refresh interval
  widget.refreshAfterDate = new Date(Date.now() + REFRESH_INTERVAL_SECONDS * 1000)
  
  // Add title
  const titleText = widget.addText(WIDGET_TITLE)
  titleText.font = Font.boldSystemFont(16)
  titleText.textColor = Color.white()
  titleText.centerAlignText()
  
  widget.addSpacer(10)
  
  // Fetch door status
  const isDoorOpen = await fetchDoorStatus()
  
  // Status text and icon based on door status
  let statusText, svgString
  
  if (isDoorOpen === null) {
    // Error state
    statusText = "Unable to check"
    svgString = DOOR_LOCKED_SVG // Default to locked when unknown
  } else if (isDoorOpen) {
    statusText = "Door is OPEN"
    svgString = DOOR_UNLOCKED_SVG
  } else {
    statusText = "Door is LOCKED"
    svgString = DOOR_LOCKED_SVG
  }
  
  // Add SVG image
  const svgImage = await createImage(svgString)
  const imageWidget = widget.addImage(svgImage)
  imageWidget.imageSize = new Size(60, 60)
  imageWidget.centerAlignImage()
  
  widget.addSpacer(5)
  
  // Add status text
  const status = widget.addText(statusText)
  status.font = Font.semiboldSystemFont(14)
  status.textColor = isDoorOpen ? new Color("#2ecc71") : new Color("#e74c3c")
  status.centerAlignText()
  
  widget.addSpacer(5)
  
  // Add last updated time
  const now = new Date()
  const timeFormatter = new DateFormatter()
  timeFormatter.useShortTimeStyle()
  const timeString = timeFormatter.string(now)
  
  const updatedText = widget.addText(`Last updated: ${timeString}`)
  updatedText.font = Font.systemFont(10)
  updatedText.textColor = Color.gray()
  updatedText.centerAlignText()
  
  return widget
}

// Helper function to create image from SVG
async function createImage(svgString) {
  const url = "data:image/svg+xml;base64," + Data.fromString(svgString).toBase64String()
  const req = new Request(url)
  return await req.loadImage()
}

// Main function
async function main() {
  const widget = await createWidget()
  
  if (config.runsInWidget) {
    Script.setWidget(widget)
  } else {
    widget.presentMedium()
  }
  
  Script.complete()
}

await main()

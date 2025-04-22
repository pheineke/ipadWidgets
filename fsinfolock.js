// Door Status Widget for Scriptable
// Shows whether the door is locked or unlocked with distinctive icons

// Configuration
const URL = "https://www.fachschaft.informatik.uni-kl.de/opendoor.json"
const WIDGET_TITLE = "Door Status"
const REFRESH_INTERVAL_SECONDS = 300 // Update every 5 minutes
const DEBUG = false // Set to true for testing with random statuses

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
  let statusText, symbolName, symbolColor
  
  if (isDoorOpen === null) {
    // Error state
    statusText = "Unable to check"
    symbolName = "exclamationmark.lock.fill"
    symbolColor = Color.yellow()
  } else if (isDoorOpen) {
    statusText = "Door is OPEN"
    symbolName = "lock.open.fill"
    symbolColor = new Color("#2ecc71") // Green
  } else {
    statusText = "Door is LOCKED"
    symbolName = "lock.fill"
    symbolColor = new Color("#e74c3c") // Red
  }
  
  // Add SF Symbol image
  const icon = SFSymbol.named(symbolName)
  const imageWidget = widget.addImage(icon.image)
  imageWidget.imageSize = new Size(60, 60)
  imageWidget.tintColor = symbolColor
  imageWidget.centerAlignImage()
  
  widget.addSpacer(5)
  
  // Add status text
  const status = widget.addText(statusText)
  status.font = Font.semiboldSystemFont(14)
  status.textColor = isDoorOpen ? new Color("#2ecc71") : new Color("#e74c3c")
  if (isDoorOpen === null) status.textColor = Color.yellow()
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

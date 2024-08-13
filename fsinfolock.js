var today = new Date()
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
var dateTime = date+' '+time

let json = false;

async function getData() {
  const url = "https://www.fachschaft.informatik.uni-kl.de/opendoor.json";
  try {
    var req = new Request(url);
    var response = await req.loadJSON();
    json = response;
  } catch (error) {
    console.error(error.message);
  }
}

async function updateWidget() {
  await getData();

  let widget = new ListWidget();

  widget.backgroundColor = json["opendoor"] ? new Color("#dddddd") : new Color("#000000");
  // Check if the door is open or closed
  let lockStatus = json["opendoor"] ? "🔓" : "🔒";

  // Create a text element to display the lock status
  let lockText = widget.addText(lockStatus);
  lockText.font = Font.boldSystemFont(64);
  lockText.textColor = new Color("#ffffff");
  lockText.centerAlignText();

  // Present the widget
  if (config.runsInWidget) {
    // Display widget on the home screen
    Script.setWidget(widget);
  } else {
    // Display widget in the app
    widget.presentMedium();
  }
}

// Initial update
updateWidget();


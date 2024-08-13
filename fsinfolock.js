var today = new Date()
var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
var dateTime = date+' '+time

let json = false;

async function getData() {
    const url = "https://www.fachschaft.informatik.uni-kl.de/opendoor.json";
    try {
      var response = await fetch(url);
      if (response.ok) {
        json = await response.json();
      }
    } catch (error) {
      console.error(error.message);
    }
  }


getData();
d

let widget = new ListWidget();

widget.backgroundColor = new Color("#1e1e1e");

// Check if the door is open or closed
let lockStatus = json["opendoor"] ? "🔓 Open" : "🔒 Closed";

// Create a text element to display the lock status
let lockText = widget.addText(lockStatus);
lockText.font = Font.boldSystemFont(24);
lockText.textColor = new Color("#ffffff");
lockText.centerAlignText();

// Set widget background color based on lock status
widget.backgroundColor = isOpen ? new Color("#00ff00") : new Color("#ff0000");

// Present the widget
if (config.runsInWidget) {
  // Display widget on the home screen
  Script.setWidget(widget);
} else {
  // Display widget in the app
  widget.presentMedium();
}

Script.complete();
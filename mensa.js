let widget = createWidget();
widget.presentMedium();

Script.setWidget(widget);
Script.complete();

function createWidget() {
    let widget = new ListWidget();
    
    const url = "https://www.mensa-kl.de/api.php?format=json&date=0";

    let json = false;
    try {
        var req = new Request(url);
        var response = req.loadJSON();
        json = response;
    } catch (error) {
        console.error(error.message);
    }

    widget.backgroundColor = new Color("#ffffff");

    let title = widget.addText("Mensa");

    title.font = Font.boldSystemFont(24);

    widget.addSpacer(10);

    let date = new Date();

    let day = date.getDay();

    let dayString = "";

    switch (day) {
        case 0:
            dayString = "Sonntag";
            break;
        case 1:
            dayString = "Montag";
            break;
        case 2:
            dayString = "Dienstag";
            break;
        case 3:
            dayString = "Mittwoch";
            break;
        case 4:
            dayString = "Donnerstag";
            break;
        case 5:
            dayString = "Freitag";
            break;
        case 6:
            dayString = "Samstag";
            break;
    }

    let dateText = widget.addText(dayString + ", " + date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear());

    dateText.font = Font.boldSystemFont(16);

    widget.addSpacer(10);

    let meals = json["meals"];

    for (let i = 0; i < meals.length; i++) {
        let meal = meals[i];

        let mealText = widget.addText(meal["name"] + " (" + meal["price"] + "€)");

        mealText.font = Font.systemFont(14);

        widget.addSpacer(5);
    }

    return widget;

}
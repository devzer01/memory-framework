
function createTextBox(text, font) {
    var oTitle = new createjs.Text(text, " 30px " + font, "#ffffff");
    oTitle.y = -80;
    oTitle.textAlign = "center";
    oTitle.textBaseline = "middle";
    oTitle.lineWidth = 300;
}
function CCredits() {

    var _oPanelContainer;
    var _oButExit;
    var _oLogo;
    var _oPanel;
    var _oListener;

    var _pStartPanelPos;

    this._init = function () {
        _oPanelContainer = new createjs.Container();
        s_oStage.addChild(_oPanelContainer);

        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oPanel = createBitmap(oSprite);
        _oListener = _oPanel.on("mousedown", this._onLogoButRelease);
        _oPanel.regX = oSprite.width / 2;
        _oPanel.regY = oSprite.height / 2;
        _oPanelContainer.addChild(_oPanel);

        _oPanelContainer.x = CANVAS_WIDTH / 2;
        _oPanelContainer.y = CANVAS_HEIGHT / 2;
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};


        _oPanelContainer.addChild(createTextBox(TEXT_DEVELOPED, FONT_GAME));
        _oPanelContainer.addChild(createTextBox("pituwa.co", FONT_GAME));

        var oLink = new createjs.Text("www.pituwa.co", " 34px " + FONT_GAME, "#ffffff");
        oLink.y = 70;
        oLink.textAlign = "center";
        oLink.textBaseline = "middle";
        oLink.lineWidth = 300;
        _oPanelContainer.addChild(oLink);

        var oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oLogo = createBitmap(oSprite);
        _oLogo.regX = oSprite.width / 2;
        _oLogo.regY = oSprite.height / 2;
        _oPanelContainer.addChild(_oLogo);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(240, -120, oSprite, _oPanelContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

    };

    this.unload = function () {

        _oButExit.setClickable(false);

        s_oStage.removeChild(_oPanelContainer);

        _oButExit.unload();


        _oPanel.on("mousedown", _oListener);
    };

    this._onLogoButRelease = function () {
        window.open("http://www.pituwa.co/");
    };

    this._onMoreGamesReleased = function () {
        window.open("http://www.pituwa.co");
    };

    this._init();


}



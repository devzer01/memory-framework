<?php
function parse_signed_request($signed_request) {
    list($encoded_sig, $payload) = explode('.', $signed_request, 2);

    $secret = "20a7157ee5b60e14a654b1c0b5b18a8b"; // Use your app secret here

    // decode the data
    $sig = base64_url_decode($encoded_sig);
    $data = json_decode(base64_url_decode($payload), true);

    // confirm the signature
    $expected_sig = hash_hmac('sha256', $payload, $secret, $raw = true);
    if ($sig !== $expected_sig) {
        error_log('Bad Signed JSON signature!');
        return null;
    }

    return $data;
}

function base64_url_decode($input) {
    return base64_decode(strtr($input, '-_', '+/'));
}

if ($_POST['signed_request']) {
    print_r(parse_signed_request($_POST['signed_request']));
}

?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <style>
            @font-face {
                font-family: warna;
                src: url(//spell.pituwa.lk/fonts/warna.ttf);
            }
        </style>
        <link rel="stylesheet" href="css/reset.css" type="text/css">
        <link rel="stylesheet" href="css/main.css" type="text/css">
		<link rel="stylesheet" href="css/orientation_utils.css" type="text/css">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui" />
	    <meta name="msapplication-tap-highlight" content="no"/>
        <script type="text/javascript" src="js/libs/jquery-2.0.3.js"></script>
        <script type="text/javascript" src="js/libs/createjs-2013.12.12.js"></script>
        <script type="text/javascript" src="js/libs/howler.js"></script>
        <script type="text/javascript" src="js/ctl_utils.js"></script>
        <script type="text/javascript" src="js/sprite_lib.js"></script>
        <script type="text/javascript" src="js/settings.js"></script>
        <script type="text/javascript" src="js/CLang.js"></script>
        <script type="text/javascript" src="js/CPreloader.js"></script>
        <script type="text/javascript" src="js/CMain.js"></script>
        <script type="text/javascript" src="js/CTextButton.js"></script>
        <script type="text/javascript" src="js/CGfxButton.js"></script>
        <script type="text/javascript" src="js/CToggle.js"></script>
        <script type="text/javascript" src="js/CMenu.js"></script>
        <script type="text/javascript" src="js/CGame.js"></script>
        <script type="text/javascript" src="js/CCard.js"></script>
        <script type="text/javascript" src="js/CLevels.js"></script>
        <script type="text/javascript" src="js/CNextLevel.js"></script>
        <script type="text/javascript" src="js/CInterface.js"></script>
        <script type="text/javascript" src="js/CGameOver.js"></script>
        <script type="text/javascript" src="js/CVictory.js"></script>
		<script type="text/javascript" src="js/CCredits.js"></script>
        
    </head>
    <body ondragstart="return false;" ondrop="return false;" >
    <fb:login-button
            scope="public_profile,email"
            onlogin="checkLoginState();">
    </fb:login-button>
    <script>
        var canvas = null;
        window.fbAsyncInit = function() {

            canvas = document.getElementById('canvas');
            FB.init({
                appId            : '177689976392966',
                autoLogAppEvents : true,
                xfbml            : true,
                version          : 'v2.12'
            });
            FB.Event.subscribe('xfbml.render', finished_rendering);
            FB.AppEvents.logPageView();
            checkLoginState();
        };

        function checkLoginState() {
            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });
        }

        var finished_rendering = function() {
            console.log("finished rendering plugins");
            var spinner = document.getElementById("spinner");
            spinner.removeAttribute("style");
            spinner.removeChild(spinner.childNodes[0]);
        };



        function statusChangeCallback(response) {
            switch (response.status) {
                case 'connected':
                    var uid = response.authResponse.userID;
                    var accessToken = response.authResponse.accessToken;
                    canvas.style.display = 'block';
                    break;
                default:
                    // Otherwise, show Login dialog first.
                    FB.login(function(response) {
                        onLogin(response);
                    }, {scope: 'email'});
                    canvas.style.display = 'block';
            }
        }

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk/debug.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));



    </script>
	<div style="position: fixed; background-color: transparent; top: 0; left: 0; width: 100%; height: 100%"></div>
          <script>

            $(document).ready(function(){
                var visible = document.getElementById('canvas').style.display === 'block';

                if (!visible) return false;
                     var oMain = new CMain({
                                                card_per_level :   [4,      //NUM CARD IN LEVEL 1
                                                                    8,      //NUM CARD IN LEVEL 2
                                                                    16,     //NUM CARD IN LEVEL 3
                                                                    20,      //NUM CARD IN LEVEL 4
                                                                    24, 28, 32],

                                                time_level:[30,  //NUM SECONDS PER LEVEL 1
                                                            60,  //NUM SECONDS PER LEVEL 2
                                                            120, //NUM SECONDS PER LEVEL 3
                                                            150, 180, 200, 240  //NUM SECONDS PER LEVEL 4
                                                            ],

                                                score_match_card: 10,     //SCORE ASSIGNED WHEN USER MATCH TWO CARDS
                                                score_time_left_mult: 2,  //MULTIPLIER ASSIGNED TO REMAINING LEVEL TIME
                                                time_match_mult: 3000,     //TIME AVAILABLE BETWEEN DISCOVERED MATCHING TO GET SCORE MULTIPLIER 
                                                show_cards: 0 ,            //IF YOU WANT TO SHOW CARDS FOR SOME SECONDS WHEN LEVEL START, SET THIS VALUE > 0 (NUM OF SECONDS)
												fullscreen:true, //SET THIS TO FALSE IF YOU DON'T WANT TO SHOW FULLSCREEN BUTTON
												check_orientation:true     //SET TO FALSE IF YOU DON'T WANT TO SHOW ORIENTATION ALERT ON MOBILE DEVICES
                                        });

                    $(oMain).on("start_session", function(evt) {
                        if(getParamValue('ctl-arcade') === "true"){
                            parent.__ctlArcadeStartSession();
                        }
                        //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("end_session", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeEndSession();
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });
                    
                    $(oMain).on("start_level", function(evt, iLevel) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeStartLevel({level:iLevel});
                           }
                    });

                    $(oMain).on("end_level", function(evt,iLevel) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeEndLevel({level:iLevel});
                           }
                    });

                    $(oMain).on("save_score", function(evt,iScore) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeSaveScore({score:iScore});
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("show_interlevel_ad", function(evt) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeShowInterlevelAD();
                           }
                           //...ADD YOUR CODE HERE EVENTUALLY
                    });

                    $(oMain).on("share_event", function(evt, iScore) {
                           if(getParamValue('ctl-arcade') === "true"){
                               parent.__ctlArcadeShareEvent({   img: TEXT_SHARE_IMAGE,
                                                                title: TEXT_SHARE_TITLE,
                                                                msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
                                                                msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1});
                           }
                    });
                     
                    if(isIOS()){
                        setTimeout(function(){sizeHandler();},200);
                    }else{
                        sizeHandler();
                    }
           });

        </script>
        <canvas id="canvas" class='ani_hack' width="1920" height="1080" style="display: block;"></canvas>
		<div data-orientation="landscape" class="orientation-msg-container">
            <p class="orientation-msg-text"><img src="sprites/turn-phone.png" alt="Please rotate your device Landscape" /></p>
        </div>
        <div id="block_game" style="position: fixed; background-color: transparent; top: 0px; left: 0px; width: 100%; height: 100%; display:none"></div>
    </body>
</html>
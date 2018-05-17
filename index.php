<?php
require_once "config.php";
header("Access-Control-Allow-Origin: *");
function parse_signed_request($signed_request)
{
    list($encoded_sig, $payload) = explode('.', $signed_request, 2);

    $secret = APPSECRET; // Use your app secret here

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

function base64_url_decode($input)
{
    return base64_decode(strtr($input, '-_', '+/'));
}

if ($_POST['signed_request']) {
    $auth = parse_signed_request($_POST['signed_request']);
}

?>
<!DOCTYPE html>
<html>
<head>
    <title></title>
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
    <script>
        var score = [];

        var showLogin = false;
        var graph = {fields: 'first_name'};
        var user = null, authResponse = null, _peek;
        var serverName = "//<?php echo SERVERNAME; ?>/";

        $.ajaxSetup({contentType: "application/json", dataType: "json"});

        var getScores = function() {
            $.get(serverName + "/scores.php", function (resp) {
                score = resp.rows.map(function (v) {
                    return {name: v.doc.user.first_name, score: v.doc.score || "0", peek: _peek};
                });
                score.sort(function (a, b) {
                   if (a.score < b.score) return 1;
                   else if (a.score > b.score) return -1;
                   return 0;
                });
            });
        };

        getScores();

        var createUser = function() {
            var data = {user: user, auth: authResponse};
            $.post(serverName + "/createuser.php", JSON.stringify(data), function (d) {
            }, 'json');
        };

        var updateScore = function(score) {
            var data = {score: score, _id: user.id, peek: _peek};
            $.post(serverName + "/savescore.php", JSON.stringify(data), function (d) {
                getScores();
            }, 'json');
        };

        window.fbAsyncInit = function () {
            FB.init({
                appId:  <?php echo APPID; ?>,
                status: true,
                xfbml: true,
                version: 'v2.12'
            });
            checkLoginState();
        };


        function checkLoginState() {
            FB.getLoginStatus(function (response) {
                statusChangeCallback(response);
            }, true);
        }


        function setVars(response) {
            user  = response;
            createUser();
        }

        function statusChangeCallback(response) {
            switch (response.status) {
                case 'connected':
                    showLogin = false;
                    authResponse = response.authResponse;
                    FB.api('/me', graph, setVars);
                    FB.api("/me/friends", {}, function (data) {
                        if (data.data.length === 0) {
                            var l = score.length;
                            for (var i = l - 1; i < 10; i++) {
                                score.push({name: "player  " + i, score: 10, peek: 0});
                                console.log(score.length);
                            }
                            $(s_oMain).trigger("leaderboard_update", {_s: score});
                        }

                    });
                    break;
                default:
                    showLogin = true;
                    break;
            }
            if (showLogin) FB.login(statusChangeCallback, {scope: 'public_profile,email, user_friends'});
        }

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    </script>
</head>
<body>
<div style="position: fixed; background-color: transparent; top: 0; left: 0; width: 100%; height: 100%"></div>
<script>

    $(document).ready(function(){
        var oMain = new CMain({
            card_per_level :   [2, 4, 6, 8, 10, 12, 16],
            _card_per_level :   [2, 4, 6, 8, 10, 12, 16],
            time_level:[5, 10, 15, 20, 25, 30, 35],
            _time_level:[5, 10, 15, 20, 25, 30, 35],
            score_match_card: 4,
            score_time_left_mult: 3,
            time_match_mult: 3000,
            show_cards: 1,
            fullscreen:true,
            check_orientation:true,
            diff_level_name: 0
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

        $(oMain).on("toggle_peek", function(evt, pk) {
            _peek = pk;
        });

        $(oMain).on("share_event", function(evt, iScore) {
            if(getParamValue('ctl-arcade') === "true"){
                parent.__ctlArcadeShareEvent({
                    img: TEXT_SHARE_IMAGE,
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

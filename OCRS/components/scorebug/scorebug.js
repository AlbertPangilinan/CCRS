function getTimeStr(time, isOT) {
    var timeStr = "";
    if (isOT) {
        timeStr += "+";
    }
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    if (seconds < 10) {
        return timeStr + minutes + ":0" + seconds;

    } else {
        return timeStr + minutes + ":" + seconds;
    }
}
function setGameInfo(gameInfo) {
    if (seriesLength == 3) {
        $('.team__games-won .team__games-won__bo5').hide();
        $('.team__games-won .team__games-won__bo7').hide();

        var teamLeftGamesWonBars = ""
        for (var i = 0; i < teamLeftGamesWon; i++) {
            teamLeftGamesWonBars += '<div class="team__games-won__game team__games-won__game--bo3"></div>'
        }

        var teamRightGamesWonBars = ""
        for (var i = 0; i < teamRightGamesWon; i++) {
            teamRightGamesWonBars += '<div class="team__games-won__game team__games-won__game--bo3"></div>'
        }

        $('.scorebug__team--left .team__games-won .team__games-won__bo3').html(teamLeftGamesWonBars);
        $('.scorebug__team--right .team__games-won .team__games-won__bo3').html(teamRightGamesWonBars);
    }

    if (seriesLength == 5) {
        $('.team__games-won .team__games-won__bo3').hide();
        $('.team__games-won .team__games-won__bo7').hide();

        var teamLeftGamesWonBars = ""
        for (var i = 0; i < teamLeftGamesWon; i++) {
            teamLeftGamesWonBars += '<div class="team__games-won__game team__games-won__game--bo5"></div>'
        }

        var teamRightGamesWonBars = ""
        for (var i = 0; i < teamRightGamesWon; i++) {
            teamRightGamesWonBars += '<div class="team__games-won__game team__games-won__game--bo5"></div>'
        }

        $('.scorebug__team--left .team__games-won .team__games-won__bo5').html(teamLeftGamesWonBars);
        $('.scorebug__team--right .team__games-won .team__games-won__bo5').html(teamRightGamesWonBars);
    }

    if (seriesLength == 7) {
        $('.team__games-won .team__games-won__bo3').hide();
        $('.team__games-won .team__games-won__bo5').hide();

        var teamLeftGamesWonBars = ""
        for (var i = 0; i < teamLeftGamesWon; i++) {
            teamLeftGamesWonBars += '<div class="team__games-won__game team__games-won__game--bo7"></div>'
        }

        var teamRightGamesWonBars = ""
        for (var i = 0; i < teamRightGamesWon; i++) {
            teamRightGamesWonBars += '<div class="team__games-won__game team__games-won__game--bo7"></div>'
        }

        $('.scorebug__team--left .team__games-won .team__games-won__bo7').html(teamLeftGamesWonBars);
        $('.scorebug__team--right .team__games-won .team__games-won__bo7').html(teamRightGamesWonBars);
    }

    $('.timer .timer__game-info .timer__game-info__series .timer__game-info__series--length').text(seriesLength);
    $('.timer .timer__bracket-stage').text(bracketStage);
}

$(() => {
    setGameInfo();    

    console.log("start web socket connection");
    WsSubscribers.init(49322, true);
    WsSubscribers.subscribe("game", "update_state", (d) => {
        var teamLeftName = d['game']['teams'][0]['name'];
        var teamRightName = d['game']['teams'][1]['name'];

        var teamLeftScore = d['game']['teams'][0]['score'];
        var teamRightScore = d['game']['teams'][1]['score'];

        var teamLeftPrimaryColor = d['game']['teams'][0]['color_primary'];
        var teamRightPrimaryColor = d['game']['teams'][1]['color_primary'];
        var teamLeftSecondaryColor = d['game']['teams'][0]['color_secondary'];
        var teamRightSecondaryColor = d['game']['teams'][1]['color_secondary'];
        
        var teamLeftColor = getTeamColor(teamLeftPrimaryColor, 1)
        var teamLeftColorLight = getTeamColor(teamLeftPrimaryColor, 0.75)
        var teamRightColor = getTeamColor(teamRightPrimaryColor, 1)
        var teamRightColorLight = getTeamColor(teamRightPrimaryColor, 0.75)

        var teamLeftColorStyle = "linear-gradient(to bottom, " + teamLeftColorLight + " 0%, " + teamLeftColorLight + " 50%, " + teamLeftColorLight + " 50%, " + teamLeftColor + " 50%, " + teamLeftColor + " 100%)"
        var teamRightColorStyle = "linear-gradient(to bottom, " + teamRightColorLight + " 0%, " + teamRightColorLight + " 50%, " + teamRightColorLight + " 50%, " + teamRightColor + " 50%, " + teamRightColor + " 100%)"                   

        var time = Math.ceil(d['game']['time']);
        var isOT = d['game']['isOT'];
        var timeStr = getTimeStr(time, isOT);
        if (isOT) {
            var gameNumStr = gameNum + " - OT";
        } else {
            var gameNumStr = gameNum;
        }

        $('.scorebug .scorebug__team--left .team__name').text(teamLeftName);
        $('.scorebug .scorebug__team--right .team__name').text(teamRightName);

        $('.scorebug .scorebug__team--left .team__score').text(teamLeftScore);
        $('.scorebug .scorebug__team--right .team__score').text(teamRightScore);

        $('.scorebug__team--left .scorebug__team--left--twotone').css("background", teamLeftColorStyle);
        $('.scorebug__team--right .scorebug__team--right--twotone').css("background", teamRightColorStyle);
        
        $('.timer .timer__game-info .timer__game-info__game .timer__game-info__game--num').text(gameNumStr);
        $('.timer .timer__time').text(timeStr);
    });
});
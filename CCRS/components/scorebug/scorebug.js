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

function setGamesWon(config) {
    if (config.seriesLength == 3) {
        $('.scorebug__score__team__games-won .scorebug__score__team__games-won__bo5').hide();
        $('.scorebug__score__team__games-won .scorebug__score__team__games-won__bo7').hide();

        var teamLeftGamesWonBars = ""
        for (var i = 0; i < config.teamLeftGamesWon; i++) {
            teamLeftGamesWonBars += '<div class="scorebug__score__team__games-won__game scorebug__score__team__games-won__game--bo3"></div>'
        }

        var teamRightGamesWonBars = ""
        for (var i = 0; i < config.teamRightGamesWon; i++) {
            teamRightGamesWonBars += '<div class="scorebug__score__team__games-won__game scorebug__score__team__games-won__game--bo3"></div>'
        }

        $('.scorebug__score__team--left .scorebug__score__team__games-won .scorebug__score__team__games-won__bo3').html(teamLeftGamesWonBars);
        $('.scorebug__score__team--right .scorebug__score__team__games-won .scorebug__score__team__games-won__bo3').html(teamRightGamesWonBars);
    }

    if (config.seriesLength == 5) {
        $('.scorebug__score__team__games-won .scorebug__score__team__games-won__bo3').hide();
        $('.scorebug__score__team__games-won .scorebug__score__team__games-won__bo7').hide();

        var teamLeftGamesWonBars = ""
        for (var i = 0; i < config.teamLeftGamesWon; i++) {
            teamLeftGamesWonBars += '<div class="scorebug__score__team__games-won__game scorebug__score__team__games-won__game--bo5"></div>'
        }

        var teamRightGamesWonBars = ""
        for (var i = 0; i < config.teamRightGamesWon; i++) {
            teamRightGamesWonBars += '<div class="scorebug__score__team__games-won__game scorebug__score__team__games-won__game--bo5"></div>'
        }

        $('.scorebug__score__team--left .scorebug__score__team__games-won .scorebug__score__team__games-won__bo5').html(teamLeftGamesWonBars);
        $('.scorebug__score__team--right .scorebug__score__team__games-won .scorebug__score__team__games-won__bo5').html(teamRightGamesWonBars);
    }

    if (config.seriesLength == 7) {
        $('.scorebug__score__team__games-won .scorebug__score__team__games-won__bo3').hide();
        $('.scorebug__score__team__games-won .scorebug__score__team__games-won__bo5').hide();

        var teamLeftGamesWonBars = ""
        for (var i = 0; i < config.teamLeftGamesWon; i++) {
            teamLeftGamesWonBars += '<div class="scorebug__score__team__games-won__game scorebug__score__team__games-won__game--bo7"></div>'
        }

        var teamRightGamesWonBars = ""
        for (var i = 0; i < config.teamRightGamesWon; i++) {
            teamRightGamesWonBars += '<div class="scorebug__score__team__games-won__game scorebug__score__team__games-won__game--bo7"></div>'
        }

        $('.scorebug__score__team--left .scorebug__score__team__games-won .scorebug__score__team__games-won__bo7').html(teamLeftGamesWonBars);
        $('.scorebug__score__team--right .scorebug__score__team__games-won .scorebug__score__team__games-won__bo7').html(teamRightGamesWonBars);
    }
}

$(() => {
    var teams = [];
    var defaultTeams = [];

    $.getJSON(cfg_ip + cfg_port + cfg_filename, config => {
        console.log(cfg_ip + cfg_port + cfg_filename);
        setGamesWon(config);
    });

    $.getJSON(cfg_ip + cfg_port + teams_filename, teamData => {
        console.log(cfg_ip + cfg_port + teams_filename);
        defaultTeams = teamData.slice(0, 3);
        teams = teamData.slice(3);
    });

    var goalData = null;
    var teamLeftScore = 0;
    var teamRightScore = 0;
    var teamLeftName = "";
    var teamLeftTag = "";
    var teamRightName = "";
    var teamRightTag = "";

    var connected = false;
    console.log("start web socket connection");
    WsSubscribers.init(true);
    setTimeout(() => { !connected && (location.reload()); }, 3000);

    WsSubscribers.subscribe("game", "goal_scored", (d) => {
        goalData = d;

        $('.scorebug .scorebug__score .scorebug__score__goal-scored .scorebug__score__goal-scored__team').css('top', 0);

        setTimeout(() => {
            $('.scorebug .scorebug__score__team--left .scorebug__score__team__score').text(teamLeftScore);
            $('.scorebug .scorebug__score__team--right .scorebug__score__team__score').text(teamRightScore);
        }, 1000);

        setTimeout(() => {
            $('.scorebug .scorebug__score .scorebug__score__goal-scored .scorebug__score__goal-scored__team').css('top', -118 + 'px');
            goalData = null;
        }, 3500);
    });

    WsSubscribers.subscribe("game", "update_state", (d) => {
        connected = true;
        $('.scorebug').css('display', 'flex');

        (!d['game'] || d['game']['hasWinner']) ? $('.scorebug').css('margin-left', -384 + 'px') : $('.scorebug').css('margin-left', 0);

        var teamLeft = d['game']['teams'][0];
        var teamRight = d['game']['teams'][1];

        teamLeftName = teamLeft['name'];        
        var teamLeftInfo = teams.find((team) => team.name.toUpperCase() === teamLeftName.toUpperCase());
        teamLeftTag = teamLeftInfo ? teamLeftInfo['tag'] : defaultTeams[0]['tag'];
        var teamLeftColor = teamLeftInfo ? teamLeftInfo['primaryColor'] : defaultTeams[0]['primaryColor'];

        teamRightName = teamRight['name'];
        var teamRightInfo = teams.find((team) => team.name.toUpperCase() === teamRightName.toUpperCase());
        teamRightTag = teamRightInfo ? teamRightInfo['tag'] : defaultTeams[1]['tag'];
        var teamRightColor = teamRightInfo ? teamRightInfo['primaryColor'] : defaultTeams[1]['primaryColor'];

        teamLeftScore = teamLeft['score'];
        teamRightScore = teamRight['score'];

        var time = Math.ceil(d['game']['time_milliseconds']);
        var isRegulation = !d['game']['hasWinner'] && !d['game']['isOT'] && !d['game']['isReplay'];
        var timeStr = getTimeStr(time, d['game']['isOT']);
        if (!isRegulation) {
            $('.scorebug .scorebug__timer .scorebug__timer--text').css('top', 0);
            $('.scorebug .scorebug__timer .scorebug__timer__time').css('top', 0);

            d['game']['isOT'] && $('.scorebug .scorebug__timer .scorebug__timer--text').text("OVERTIME");
            d['game']['isReplay'] && $('.scorebug .scorebug__timer .scorebug__timer--text').text("REPLAY");
        } else {
            $('.scorebug .scorebug__timer .scorebug__timer--text').css('top', -45 + 'px');
            $('.scorebug .scorebug__timer .scorebug__timer__time').css('top', -20 + 'px');
            $('.scorebug .scorebug__timer .scorebug__timer--text').text();
        }


        if (!goalData) {
            $('.scorebug .scorebug__score__team--left .scorebug__score__team__score').text(teamLeftScore);
            $('.scorebug .scorebug__score__team--right .scorebug__score__team__score').text(teamRightScore);
        } else {
            var goalScorerTeamName = d['game']['teams'][goalData['scorer'].teamnum]['name'];        
            var goalScorerTeamInfo = teams.find((team) => team.name.toUpperCase() === goalScorerTeamName.toUpperCase());
            var goalScorerTeamColor = goalScorerTeamInfo ? goalScorerTeamInfo['primaryColor'] : defaultTeams[goalData['scorer'].teamnum]['primaryColor'];
    
            $('.scorebug .scorebug__score .scorebug__score__goal-scored .scorebug__score__goal-scored__team').css('background-color', goalScorerTeamColor);
        }

        $('.scorebug .scorebug__score__team--left').css('background-color', teamLeftColor);
        $('.scorebug .scorebug__score__team--right').css('background-color', teamRightColor);
        $('.scorebug .scorebug__timer .scorebug__timer__time').text(timeStr);
    });

    WsSubscribers.subscribe("game", "post_countdown_begin", (d) => {
        $('.scorebug__score__team__games-won .scorebug__score__team__games-won__container').css('top', -12 + 'px');

        setTimeout(() => {
            $('.scorebug .scorebug__score').css('width', 450 + 'px');
        }, 500);
        setTimeout(() => {
            $('.scorebug .scorebug__score__team--left .scorebug__score__team__name').text(teamLeftName);
            $('.scorebug .scorebug__score__team--right .scorebug__score__team__name').text(teamRightName);
        }, 750);
    });

    WsSubscribers.subscribe("game", "round_started_go", (d) => {
        setTimeout(() => {
            $('.scorebug .scorebug__score').css('width', 200 + 'px');
            $('.scorebug .scorebug__score__team--left .scorebug__score__team__name').text(teamLeftTag);
            $('.scorebug .scorebug__score__team--right .scorebug__score__team__name').text(teamRightTag);
        }, 2000);

        setTimeout(() => {
            $('.scorebug__score__team__games-won .scorebug__score__team__games-won__container').css('top', 4 + 'px');
        }, 2500);
    });
    
    WsSubscribers.subscribe("game", "match_destroyed", () => location.reload());
});
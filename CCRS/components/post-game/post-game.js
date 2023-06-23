$(() => {
    $.getJSON(cfg_ip + cfg_port + cfg_filename, config => {
        console.log(cfg_ip + cfg_port + cfg_filename);

        var seriesInfoText = "Game " + config.gameNum + " | Best of " + config.seriesLength
        var winCondition = Math.floor(config.seriesLength / 2) + 1;

        if (config.teamLeftGamesWon > config.teamRightGamesWon) {
            var leadingTeam = "Blue"
            var seriesUpdate = (config.teamLeftGamesWon >= winCondition) ? " wins " : " leads ";
        } else if (config.teamRightGamesWon > config.teamLeftGamesWon) {
            var leadingTeam = "Orange"
            var seriesUpdate = (config.teamRightGamesWon >= winCondition) ? " wins " : " leads ";
        } else {
            var leadingTeam = ""
            var seriesUpdate = "Series tied "
        }

        var seriesStatusText = leadingTeam + seriesUpdate + config.teamLeftGamesWon + "-" + config.teamRightGamesWon;

        $('.post-game__game-info .post-game__game-info__tournament').text(config.tournamentInfo);
        $('.post-game__game-info .post-game__game-info__series').text(seriesInfoText);

        $('.post-game__series-status').text(seriesStatusText);
    });

    var teams = [];
    var defaultTeams = [];

    $.getJSON(cfg_ip + cfg_port + teams_filename, teamData => {
        console.log(cfg_ip + cfg_port + teams_filename);
        defaultTeams = teamData.slice(0, 3);
        teams = teamData.slice(3);
    });

    var connected = false;
    console.log("start web socket connection");
    WsSubscribers.init(true);
    setTimeout(() => { !connected && (location.reload()); }, 3000);

    WsSubscribers.subscribe("game", "update_state", (d) => {
        connected = true;
        
        var teamLeft = d['game']['teams'][0];
        var teamLeftName = teamLeft['name'];
        var teamLeftScore = teamLeft['score'];
        var teamLeftInfo = teams.find((team) => team.name.toUpperCase() === teamLeftName.toUpperCase());
        var teamLeftColor = teamLeftInfo ? teamLeftInfo['primaryColor'] : defaultTeams[0]['primaryColor'];

        var teamRight = d['game']['teams'][1];
        var teamRightName = teamRight['name'];
        var teamRightScore = teamRight['score'];
        var teamRightInfo = teams.find((team) => team.name.toUpperCase() === teamRightName.toUpperCase());
        var teamRightColor = teamRightInfo ? teamRightInfo['primaryColor'] : defaultTeams[1]['primaryColor'];

        var players = Object.values(d['players'])
        var teamLeftPlayers = players.filter((player) => player.team == 0);
        var teamRightPlayers = players.filter((player) => player.team == 1);

        var teamLeftScoreTotal = teamLeftPlayers[0].score + teamLeftPlayers[1].score + teamLeftPlayers[2].score;
        var teamRightScoreTotal = teamRightPlayers[0].score + teamRightPlayers[1].score + teamRightPlayers[2].score;

        var teamLeftScorePercent = (teamLeftScoreTotal / (teamLeftScoreTotal + teamRightScoreTotal) * 100) + "%";
        var teamRightScorePercent = (teamRightScoreTotal / (teamLeftScoreTotal + teamRightScoreTotal) * 100) + "%";

        var teamLeftGoalsTotal = teamLeftPlayers[0].goals + teamLeftPlayers[1].goals + teamLeftPlayers[2].goals;
        var teamRightGoalsTotal = teamRightPlayers[0].goals + teamRightPlayers[1].goals + teamRightPlayers[2].goals;

        var teamLeftGoalsPercent = (teamLeftGoalsTotal / (teamLeftGoalsTotal + teamRightGoalsTotal) * 100) + "%";
        var teamRightGoalsPercent = (teamRightGoalsTotal / (teamLeftGoalsTotal + teamRightGoalsTotal) * 100) + "%";

        var teamLeftAssistsTotal = teamLeftPlayers[0].assists + teamLeftPlayers[1].assists + teamLeftPlayers[2].assists;
        var teamRightAssistsTotal = teamRightPlayers[0].assists + teamRightPlayers[1].assists + teamRightPlayers[2].assists;

        var teamLeftAssistsPercent = (teamLeftAssistsTotal / (teamLeftAssistsTotal + teamRightAssistsTotal) * 100) + "%";
        var teamRightAssistsPercent = (teamRightAssistsTotal / (teamLeftAssistsTotal + teamRightAssistsTotal) * 100) + "%";

        var teamLeftShotsTotal = teamLeftPlayers[0].shots + teamLeftPlayers[1].shots + teamLeftPlayers[2].shots;
        var teamRightShotsTotal = teamRightPlayers[0].shots + teamRightPlayers[1].shots + teamRightPlayers[2].shots;

        var teamLeftShotsPercent = (teamLeftShotsTotal / (teamLeftShotsTotal + teamRightShotsTotal) * 100) + "%";
        var teamRightShotsPercent = (teamRightShotsTotal / (teamLeftShotsTotal + teamRightShotsTotal) * 100) + "%";

        var teamLeftSavesTotal = teamLeftPlayers[0].saves + teamLeftPlayers[1].saves + teamLeftPlayers[2].saves;
        var teamRightSavesTotal = teamRightPlayers[0].saves + teamRightPlayers[1].saves + teamRightPlayers[2].saves;

        var teamLeftSavesPercent = (teamLeftSavesTotal / (teamLeftSavesTotal + teamRightSavesTotal) * 100) + "%";
        var teamRightSavesPercent = (teamRightSavesTotal / (teamLeftSavesTotal + teamRightSavesTotal) * 100) + "%";

        var teamLeftDemosTotal = teamLeftPlayers[0].demos + teamLeftPlayers[1].demos + teamLeftPlayers[2].demos;
        var teamRightDemosTotal = teamRightPlayers[0].demos + teamRightPlayers[1].demos + teamRightPlayers[2].demos;

        var teamLeftDemosPercent = (teamLeftDemosTotal / (teamLeftDemosTotal + teamRightDemosTotal) * 100) + "%";
        var teamRightDemosPercent = (teamRightDemosTotal / (teamLeftDemosTotal + teamRightDemosTotal) * 100) + "%";

        $('.post-game__score .post-game__score__team--left').css('background-color', teamLeftColor);
        $('.post-game__score .post-game__score__team--right').css('background-color', teamRightColor);

        $('.post-game__table .post-game__table__player-names .post-game__table__player-name--left').css('border-color', teamLeftColor);
        $('.post-game__table .post-game__table__player-names .post-game__table__player-name--right').css('border-color', teamRightColor);

        $('.post-game__table .post-game__table__stats .post-game__table__stat--header .post-game__table__stat--header__percents--left').css('background-color', teamLeftColor);
        $('.post-game__table .post-game__table__stats .post-game__table__stat--header .post-game__table__stat--header__percents--right').css('background-color', teamRightColor);

        $('.post-game__score .post-game__score__team--left .post-game__score__team__name').text(teamLeftName);
        $('.post-game__score .post-game__score__team--right .post-game__score__team__name').text(teamRightName);

        $('.post-game__score .post-game__score__team--left .post-game__score__team__score').text(teamLeftScore);
        $('.post-game__score .post-game__score__team--right .post-game__score__team__score').text(teamRightScore);

        $('.post-game__table .post-game__table__player-names .post-game__table__player-name--left1').text(teamLeftPlayers[0].name);
        $('.post-game__table .post-game__table__player-names .post-game__table__player-name--left2').text(teamLeftPlayers[1].name);
        $('.post-game__table .post-game__table__player-names .post-game__table__player-name--left3').text(teamLeftPlayers[2].name);

        $('.post-game__table .post-game__table__player-names .post-game__table__player-name--right1').text(teamRightPlayers[0].name);
        $('.post-game__table .post-game__table__player-names .post-game__table__player-name--right2').text(teamRightPlayers[1].name);
        $('.post-game__table .post-game__table__player-names .post-game__table__player-name--right3').text(teamRightPlayers[2].name);

        $('.post-game__table .post-game__table__stats--score .post-game__table__stat--left1.post-game__table__stat--score').text(teamLeftPlayers[0].score);
        $('.post-game__table .post-game__table__stats--score .post-game__table__stat--left2.post-game__table__stat--score').text(teamLeftPlayers[1].score);
        $('.post-game__table .post-game__table__stats--score .post-game__table__stat--left3.post-game__table__stat--score').text(teamLeftPlayers[2].score);

        $('.post-game__table .post-game__table__stats--score .post-game__table__stat--header .post-game__table__stat--header__percents--left').css('width', teamLeftScorePercent);
        $('.post-game__table .post-game__table__stats--score .post-game__table__stat--header .post-game__table__stat--header__percents--right').css('width', teamRightScorePercent);

        $('.post-game__table .post-game__table__stats--score .post-game__table__stat--right1.post-game__table__stat--score').text(teamRightPlayers[0].score);
        $('.post-game__table .post-game__table__stats--score .post-game__table__stat--right2.post-game__table__stat--score').text(teamRightPlayers[1].score);
        $('.post-game__table .post-game__table__stats--score .post-game__table__stat--right3.post-game__table__stat--score').text(teamRightPlayers[2].score);

        $('.post-game__table .post-game__table__stats--goals .post-game__table__stat--left1.post-game__table__stat--goals').text(teamLeftPlayers[0].goals);
        $('.post-game__table .post-game__table__stats--goals .post-game__table__stat--left2.post-game__table__stat--goals').text(teamLeftPlayers[1].goals);
        $('.post-game__table .post-game__table__stats--goals .post-game__table__stat--left3.post-game__table__stat--goals').text(teamLeftPlayers[2].goals);

        $('.post-game__table .post-game__table__stats--goals .post-game__table__stat--header .post-game__table__stat--header__percents--left').css('width', teamLeftGoalsPercent);
        $('.post-game__table .post-game__table__stats--goals .post-game__table__stat--header .post-game__table__stat--header__percents--right').css('width', teamRightGoalsPercent);

        $('.post-game__table .post-game__table__stats--goals .post-game__table__stat--right1.post-game__table__stat--goals').text(teamRightPlayers[0].goals);
        $('.post-game__table .post-game__table__stats--goals .post-game__table__stat--right2.post-game__table__stat--goals').text(teamRightPlayers[1].goals);
        $('.post-game__table .post-game__table__stats--goals .post-game__table__stat--right3.post-game__table__stat--goals').text(teamRightPlayers[2].goals);

        $('.post-game__table .post-game__table__stats--assists .post-game__table__stat--left1.post-game__table__stat--assists').text(teamLeftPlayers[0].assists);
        $('.post-game__table .post-game__table__stats--assists .post-game__table__stat--left2.post-game__table__stat--assists').text(teamLeftPlayers[1].assists);
        $('.post-game__table .post-game__table__stats--assists .post-game__table__stat--left3.post-game__table__stat--assists').text(teamLeftPlayers[2].assists);

        $('.post-game__table .post-game__table__stats--assists .post-game__table__stat--header .post-game__table__stat--header__percents--left').css('width', teamLeftAssistsPercent);
        $('.post-game__table .post-game__table__stats--assists .post-game__table__stat--header .post-game__table__stat--header__percents--right').css('width', teamRightAssistsPercent);

        $('.post-game__table .post-game__table__stats--assists .post-game__table__stat--right1.post-game__table__stat--assists').text(teamRightPlayers[0].assists);
        $('.post-game__table .post-game__table__stats--assists .post-game__table__stat--right2.post-game__table__stat--assists').text(teamRightPlayers[1].assists);
        $('.post-game__table .post-game__table__stats--assists .post-game__table__stat--right3.post-game__table__stat--assists').text(teamRightPlayers[2].assists);

        $('.post-game__table .post-game__table__stats--shots .post-game__table__stat--left1.post-game__table__stat--shots').text(teamLeftPlayers[0].shots);
        $('.post-game__table .post-game__table__stats--shots .post-game__table__stat--left2.post-game__table__stat--shots').text(teamLeftPlayers[1].shots);
        $('.post-game__table .post-game__table__stats--shots .post-game__table__stat--left3.post-game__table__stat--shots').text(teamLeftPlayers[2].shots);
        
        $('.post-game__table .post-game__table__stats--shots .post-game__table__stat--header .post-game__table__stat--header__percents--left').css('width', teamLeftShotsPercent);
        $('.post-game__table .post-game__table__stats--shots .post-game__table__stat--header .post-game__table__stat--header__percents--right').css('width', teamRightShotsPercent);

        $('.post-game__table .post-game__table__stats--shots .post-game__table__stat--right1.post-game__table__stat--shots').text(teamRightPlayers[0].shots);
        $('.post-game__table .post-game__table__stats--shots .post-game__table__stat--right2.post-game__table__stat--shots').text(teamRightPlayers[1].shots);
        $('.post-game__table .post-game__table__stats--shots .post-game__table__stat--right3.post-game__table__stat--shots').text(teamRightPlayers[2].shots);

        $('.post-game__table .post-game__table__stats--saves .post-game__table__stat--left1.post-game__table__stat--saves').text(teamLeftPlayers[0].saves);
        $('.post-game__table .post-game__table__stats--saves .post-game__table__stat--left2.post-game__table__stat--saves').text(teamLeftPlayers[1].saves);
        $('.post-game__table .post-game__table__stats--saves .post-game__table__stat--left3.post-game__table__stat--saves').text(teamLeftPlayers[2].saves);

        $('.post-game__table .post-game__table__stats--saves .post-game__table__stat--header .post-game__table__stat--header__percents--left').css('width', teamLeftSavesPercent);
        $('.post-game__table .post-game__table__stats--saves .post-game__table__stat--header .post-game__table__stat--header__percents--right').css('width', teamRightSavesPercent);

        $('.post-game__table .post-game__table__stats--saves .post-game__table__stat--right1.post-game__table__stat--saves').text(teamRightPlayers[0].saves);
        $('.post-game__table .post-game__table__stats--saves .post-game__table__stat--right2.post-game__table__stat--saves').text(teamRightPlayers[1].saves);
        $('.post-game__table .post-game__table__stats--saves .post-game__table__stat--right3.post-game__table__stat--saves').text(teamRightPlayers[2].saves);

        $('.post-game__table .post-game__table__stats--demos .post-game__table__stat--left1.post-game__table__stat--demos').text(teamLeftPlayers[0].demos);
        $('.post-game__table .post-game__table__stats--demos .post-game__table__stat--left2.post-game__table__stat--demos').text(teamLeftPlayers[1].demos);
        $('.post-game__table .post-game__table__stats--demos .post-game__table__stat--left3.post-game__table__stat--demos').text(teamLeftPlayers[2].demos);

        $('.post-game__table .post-game__table__stats--demos .post-game__table__stat--header .post-game__table__stat--header__percents--left').css('width', teamLeftDemosPercent);
        $('.post-game__table .post-game__table__stats--demos .post-game__table__stat--header .post-game__table__stat--header__percents--right').css('width', teamRightDemosPercent);

        $('.post-game__table .post-game__table__stats--demos .post-game__table__stat--right1.post-game__table__stat--demos').text(teamRightPlayers[0].demos);
        $('.post-game__table .post-game__table__stats--demos .post-game__table__stat--right2.post-game__table__stat--demos').text(teamRightPlayers[1].demos);
        $('.post-game__table .post-game__table__stats--demos .post-game__table__stat--right3.post-game__table__stat--demos').text(teamRightPlayers[2].demos);

        WsSubscribers.subscribe("game", "match_ended", () => {
            setTimeout(() => {
                $('.post-game').css('display', 'block');
            }, 7500);    
        });

        WsSubscribers.subscribe("game", "match_destroyed", () => location.reload());
    });
});
$(() => {
    $('.replay .replay__stats .replay__assister').hide();

    var goalData = null;
    
    $.getJSON(cfg_ip + cfg_port + teams_filename, teamData => {
        console.log(cfg_ip + cfg_port + teams_filename);
        defaultTeams = teamData.slice(0, 3);
        teams = teamData.slice(3);
    });

    var connected = false;
    console.log("start web socket connection");
    WsSubscribers.init(true);
    setTimeout(() => { !connected && (location.reload()); }, 3000);

    WsSubscribers.subscribe("game", "goal_scored", (d) => {
        goalData = d;
    });

    WsSubscribers.subscribe("game", "update_state", (d) => {
        connected = true;
        $('.replay').css('display', 'flex');
        
        (!d['game']['hasWinner'] && d['game']['isReplay']) ? $('.replay').css('bottom', 0) : $('.replay').css('bottom', -146 + 'px');

        var goalScorer = goalData['scorer'];
        var assister = goalData['assister'];
        goalData['assister'].name && ($('.replay .replay__stats .replay__assister').show());

        var ballSpeed = goalData['goalspeed'];
        var teamName = d['game']['teams'][goalScorer.teamnum]['name'];        
        var teamInfo = teams.find((team) => team.name.toUpperCase() === teamName.toUpperCase());
        var teamColor = teamInfo ? teamInfo['primaryColor'] : defaultTeams[goalScorer.teamnum]['primaryColor'];
        
        $('.replay .replay__stats--bottom').css('background-color', teamColor);
        $('.replay .replay__stats .replay__goalscorer .replay__goalscorer__value').text(goalScorer.name);
        $('.replay .replay__stats .replay__ball-speed .replay__ball-speed__value').text(Math.round(ballSpeed) + " km/h");
        $('.replay .replay__stats .replay__assister .replay__assister__value').text(assister.name);
    });

    WsSubscribers.subscribe("game", "match_destroyed", () => location.reload());
});
$(() => {
    $('.left-boost__player-container').hide();

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
        $('.left-boost').css('display', 'block');
        
        (d['game']['hasWinner'] || d['game']['isReplay']) ? $('.left-boost').css('margin-left', -225 + 'px') : $('.left-boost').css('margin-left', 0);
        
        var currentPlayer = d['game']['hasTarget'] ? d['players'][d['game']['target']] : null;

        var players = Object.values(d['players'])
        var team = players.filter((player) => player.team == 0);
        var teamName = d['game']['teams'][0]['name'];        
        var teamInfo = teams.find((team) => team.name.toUpperCase() === teamName.toUpperCase());
        var teamColor = teamInfo ? teamInfo['primaryColor'] : defaultTeams[0]['primaryColor'];

        $('.left-boost .left-boost__player-container').css('background-color', teamColor);

        team.forEach((player, i) => {
            $('.left-boost__player' + (i + 1)).show();
            $('.left-boost__player' + (i + 1) + ' .left-boost__player__text .left-boost__player__text__name').text(player.name);
            $('.left-boost__player' + (i + 1) + ' .left-boost__player__text .left-boost__player__text__boost').text(player.boost);
            $('.left-boost__player' + (i + 1) + ' .left-boost__player__boost .left-boost__player__boost--fill').css('width', player.boost / 100 * 224 + 'px');
    
            currentPlayer && player['id'] == currentPlayer['id'] ? $('.left-boost__player' + (i + 1)).css('outline', '2px solid white') : $('.left-boost__player' + (i + 1)).css('outline', 'none');
        });
    });

    WsSubscribers.subscribe("game", "match_destroyed", () => location.reload());
});
$(() => {
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
        $('.current-player').css('display', 'flex');

        d['game']['hasTarget'] ? $('.current-player').css('margin-left', 0) : $('.current-player').css('margin-left', -425 + 'px');

        var currentPlayer = d['players'][d['game']['target']];
        var currentPlayerTeamName = d['game']['teams'][currentPlayer.team]['name'];
        var currentPlayerTeamInfo = teams.find((team) => team.name.toUpperCase() === currentPlayerTeamName.toUpperCase());
        var currentPlayerTeamColor = currentPlayerTeamInfo ? currentPlayerTeamInfo['primaryColor'] : defaultTeams[currentPlayer.team]['primaryColor'];
        var currentPlayerTag = currentPlayerTeamInfo ? "[" + currentPlayerTeamInfo['tag'] + "] " : "[" + defaultTeams[currentPlayer.team]['tag'] + "] ";
        var currentPlayerDisplayName = currentPlayerTag + currentPlayer['name'];
        
        $('.current-player .current-player__name').css('background-color', currentPlayerTeamColor);
        $('.current-player .current-player__name').text(currentPlayerDisplayName);

        $('.current-player .current-player__stats .current-player__stats__stat .current-player__stats__stat__text.current-player__stats__stat--goals').text(currentPlayer.goals);
        $('.current-player .current-player__stats .current-player__stats__stat .current-player__stats__stat__text.current-player__stats__stat--assists').text(currentPlayer.assists);
        $('.current-player .current-player__stats .current-player__stats__stat .current-player__stats__stat__text.current-player__stats__stat--shots').text(currentPlayer.shots);
        $('.current-player .current-player__stats .current-player__stats__stat .current-player__stats__stat__text.current-player__stats__stat--saves').text(currentPlayer.saves);

        $('.current-player .current-player__boost--fill').css('width', currentPlayer.boost + '%');
    });

    WsSubscribers.subscribe("game", "match_destroyed", () => location.reload());
});
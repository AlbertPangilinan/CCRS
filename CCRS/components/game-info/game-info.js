$(() => {
    $.getJSON(cfg_ip + cfg_port + cfg_filename, config => {
        console.log(cfg_ip + cfg_port + cfg_filename);

        var seriesInfoText = "Game " + config.gameNum + " | Best of " + config.seriesLength;
        $('.game-info .game-info__tournament').text(config.tournamentInfo);
        $('.game-info .game-info__series').text(seriesInfoText);
    });

    var connected = false;
    console.log("start web socket connection");
    WsSubscribers.init(true);
    setTimeout(() => { !connected && (location.reload()); }, 3000);

    WsSubscribers.subscribe("game", "update_state", (d) => {
        connected = true;
        $('.game-info').css('display', 'flex');
        
        (!d['game'] || d['game']['hasWinner']) ? $('.game-info').css('top', -80 + 'px') : $('.game-info').css('top', 0);
    });    

    WsSubscribers.subscribe("game", "match_destroyed", () => location.reload());
});
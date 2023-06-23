$(() => {
    var connected = false;
    console.log("start web socket connection");
    WsSubscribers.init(true);
    setTimeout(() => { !connected && (location.reload()); }, 3000);

    WsSubscribers.subscribe("game", "update_state", (d) => {
        connected = true;
        
        (d['game']['hasWinner'] || (!d['game']['hasTarget'] && d['game']['isReplay'])) ? $('.logo').css('margin-right', 0) : $('.logo').css('margin-right', -218 + 'px');
    });

    WsSubscribers.subscribe("game", "match_destroyed", () => location.reload());
});
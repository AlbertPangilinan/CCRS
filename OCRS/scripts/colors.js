function hexToRGB(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getTeamColor(hex, a) {
    var color = hexToRGB(hex);
    if (color.r < 30 && color.g < 30 && color.b < 30) {
        a -= 0.2
    }
    return "rgba(" + color.r + ", " + color.g + ", " + color.b + ", " + a + ")";
}

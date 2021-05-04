scene = null;

function pollChannelNumber() {
    window.obsstudio.getCurrentScene(function(object) {
        scene = object;
    })
    
    if (scene != null && scene.name.includes("-c")) {
        number = scene.name.split(" -c ");
        return number[1];
    } else {
        return null;
    }
}

function doSimpleAjax(url) {
    return $.ajax({
        'async': false,
        'type': "GET",
        'global': false,
        'url': url,
        'success': function(data) {
            return data;
        },
        'error': function() {
            return null;
        }
    })
}

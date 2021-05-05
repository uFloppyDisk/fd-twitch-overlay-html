let episodeManager = new EpisodeManager();

let finishedInit = false;

let WIDTH_LIMIT = 16;

let file_map = [
    "most_recent_subscriber.txt",
    "most_recent_donator.txt",
    "most_recent_follower.txt",
    "Snip.txt"
];

let entries = [[],[],[],[]];

function destroyGarbage() {
    let channels = $(".episodes > div");

    channels.each(function(index, value) {
        let episodes = $(value).find("div.episode");
        if (episodes.length > 7) {
            console.log(`Channel offset ${index} has more than 7 episodes. Deleting episodes...`)
            $(value).find("div.episode:gt(6)").remove();
        }
    })
}

function update() {
    if (!finishedInit) {
        return;
    }

    let timeslot = getRoundedTime();
    let current_timeslot = $(".flex-container-header > div:nth-child(2) > span").text();

    if (!(current_timeslot === timeslot)) {
        timeslots = $(".flex-container-header > div > span.timeslot");

        timeslots.each(function(index, element) {
            let offset = 1800 * index;
            roundedTime = getRoundedTime(offset);

            console.log(`Replacing timeslot ${index+1} with ${roundedTime}`);
            $(element).text(roundedTime);
        });
    }

    isUpdated = false;
    file_map.forEach(function(value, index) {
        $.ajax({
            'async': true,
            'type': "GET",
            'global': false,
            'url': "./data/" + value,
            'success': function(data) {
                ret = data.trim();

                if (ret === null || ret.length < 4) {
                    return true;
                }
        
                let episode = episodeManager.addEpisode(ret, index);
        
                if (episode === false) {
                    return true;
                }
        
                if (episode instanceof Episode) {
                    addEpisodeToHTML(episode, index, true);
                }

                setTimeout(animate, 100, ENUM_CHANNELS[index]);
            },
            'error': function() {
                console.log(`Error reading file ${value}`);
            },
            'cache': false

        });
    });

    if (isUpdated) {
        storage.updateEntry("entries", entries);
    }

    destroyGarbage();
}

function animate(channel) {
    requestAnimationFrame(() => {
        $(`#${channel} .anim-start.width-1`).removeClass("anim-start").removeClass("width-1").addClass("anim").addClass("ep-width-1");
        $(`#${channel} .anim-start.width-2`).removeClass("anim-start").removeClass("width-2").addClass("anim").addClass("ep-width-2");
        $(`#${channel} .anim-start.width-3`).removeClass("anim-start").removeClass("width-3").addClass("anim").addClass("ep-width-3");
    });
}

function handleError(evt) {
    if (evt.message) {
        alert("error: "+evt.message +" at linenumber: "+evt.lineno+" of file: "+evt.filename);
    } else {
        alert("error: "+evt.type+" from element: "+(evt.srcElement || evt.target));
    }
}

function init() {
    // window.addEventListener("error", handleError, true);

    for (let i = 0; i < 6; i++) {
        let offset = i * 1800;
        let value = getRoundedTime(offset);

        console.log(`Offset: ${offset} | Value: ${value}`);

        addHeader(value);
    }

    episodeManager.init();

    episodeManager.getChannels().forEach(function(episodes, index) {
        if (episodes.length < 1) {
            return true;
        }

        let temp = episodes.slice().reverse();
        temp.forEach(function(episode, x) {
            addEpisodeToHTML(episode, index);
            setTimeout(animate, 100, ENUM_CHANNELS[index]);
        });
    })

    finishedInit = true;
}
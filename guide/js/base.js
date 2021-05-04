let storage = new StorageManager();

let finishedInit = false;

let EPISODE_LIMIT = 7;
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
        let ret = null;

        $.ajax({
            'async': false,
            'type': "GET",
            'global': false,
            'url': "./data/" + value,
            'success': function(data) {
                ret = data;
            },
            'error': function() {
                console.log(`Error reading file ${value}`);
                ret = null;
            },
            'cache': false

        });

        ret = ret.trim();

        if (ret === null || ret.length < 4) {
            return true;
        }

        if (entries[index][0] != ret) {
            console.log(`File ${value} has changed to ${ret}`);
            entries[index].unshift(ret);
            isUpdated = true;

            addEpisode(ret, index, true);

            if (entries[index].length > EPISODE_LIMIT) {
                entries[index] = trim(entries[index], EPISODE_LIMIT);
            }
        }
    });

    if (isUpdated) {
        storage.updateEntry("entries", entries);
    }

    destroyGarbage();
}

function animate() {
    requestAnimationFrame(() => {
        $(".anim-start.width-1").removeClass("anim-start").removeClass("width-1").addClass("anim").addClass("ep-width-1");
        $(".anim-start.width-2").removeClass("anim-start").removeClass("width-2").addClass("anim").addClass("ep-width-2");
        $(".anim-start.width-3").removeClass("anim-start").removeClass("width-3").addClass("anim").addClass("ep-width-3");
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

    try {
        entries = storage.getEntry("entries", true);
    } catch (exc) {
        storage.createEntry("entries", entries);
    }

    for (let i = 0; i < 6; i++) {
        let offset = i * 1800;
        let value = getRoundedTime(offset);

        console.log(`Offset: ${offset} | Value: ${value}`);

        addHeader(value);
    }

    entries.forEach(function(values, index) {
        if (values instanceof Array && values.length > 0) {
            temp = values.slice().reverse();
            temp.forEach(function(value, x) {
                addEpisode(value, index);
            });
        } else {
            entries[index] = [];
        }
    });

    finishedInit = true;
}
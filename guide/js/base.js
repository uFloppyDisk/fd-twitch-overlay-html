let storage = new StorageManager();

let EPISODE_LIMIT = 7;
let WIDTH_LIMIT = 16;

let file_map = [
    "most_recent_subscriber.txt",
    "most_recent_donator.txt",
    "most_recent_follower.txt",
    "Snip.txt"
];

let entries = [[],[],[],[]];
let old_entries = [null,null,null,null];
let new_entries = [null,null,null,null];

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
    let timeslot = getRoundedTime();
    let current_timeslot = $(".flex-container-header > div:nth-child(2) > span").text();

    if (!(current_timeslot === timeslot)) {
        let offset = 3600 * 3;
        let future_timeslot = getRoundedTime(offset);

        addHeader(future_timeslot, true);
    }

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
                ret = null;
            }
        })

        new_entries[index] = ret;
    });

    storage.updateEntry("new_entries", new_entries);

    new_entries.forEach(function(value, index) {
        if ((!(value === null)) && value.length > 0) {
            if (!(old_entries[index] === value)) {
                addEpisode(value, index, true);

                old_entries[index] = value;

                entries = storage.getEntry("entries", true);
                modify_array = entries[index];

                modify_array.push(value);
                if (modify_array.length > EPISODE_LIMIT) {
                    modify_array = last(modify_array, EPISODE_LIMIT)
                }

                entries[index] = modify_array;
                storage.updateEntry("entries", entries);
            }
        }
    });

    destroyGarbage();
}

function animate() {
    requestAnimationFrame(() => {
        $(".anim-start.width-1").removeClass("anim-start").removeClass("width-1").addClass("anim").addClass("ep-width-1");
        $(".anim-start.width-2").removeClass("anim-start").removeClass("width-2").addClass("anim").addClass("ep-width-2");
        $(".anim-start.width-3").removeClass("anim-start").removeClass("width-3").addClass("anim").addClass("ep-width-3");
    });
}

function init() {
    try {
        entries = storage.getEntry("entries", true);
    } catch (exc) {
        storage.createEntry("entries", entries);
    }

    try {
        new_entries = storage.getEntry("new_entries", true);
    } catch (exc) {
        storage.createEntry("new_entries", new_entries);
    }

    for (let i = 0; i < 6; i++) {
        let offset = i * 1800;
        let value = getRoundedTime(offset);

        console.log(`Offset: ${offset} | Value: ${value}`);

        addHeader(value);
    }

    entries.forEach(function(values, index) {
        if (values instanceof Array && values.length > 0) {
            new_entries[index] = last(values);
            old_entries[index] = new_entries[index];
            values.forEach(function(value, x) {
                addEpisode(value, index);
            });
        } else {
            entries[index] = [];
        }
    });
}
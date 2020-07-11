let initFinished = false;

let channels = {};
let current_channel = null;

function generateEpisodeTimes(channel, isFirstEpisode=false) {
    schedule = channel.schedule.schedule;

    time_start = 0;
    time_end = 0;

    if (isFirstEpisode) {
        let now = new Date();
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        time_start = now.valueOf();
    } else {
        time_start = schedule[schedule.length - 1].getEnd;
    }

    episode_duration = channel.durations[Math.floor(Math.random() * channel.durations.length)];

    duration_hours = Math.floor(episode_duration / 60);
    duration_minutes = episode_duration % 60;

    time_end = time_start + (duration_hours*60*60*1000) + (duration_minutes*60*1000);

    return [time_start, time_end];
}

function getEpisode(channel, times) {
    try {
        let episode_name = null;

        let title_switch = Math.floor(Math.random() * 2);
        if (title_switch == 0) {
            episode_name = channels["global"].episode.titles[Math.floor(Math.random() * channels["global"].episode.titles.length)];
        } else {
            episode_name = channel.titles[Math.floor(Math.random() * channel.titles.length)]; 
        }
    
        let episode = new Episode(episode_name, times[0], times[1]);

        return episode;
    } catch (e) {
        return false;
    }
}

function handleSceneTransitionFinished(event) {
    if (event.detail.name.includes("-c")) {
        if (ARGS.get("animate") == "true") {
            $("#hide").addClass("animate");
        }  
    }
    console.log(`Finished transition to ${event.detail.name}`)
}

function handleSceneChange() {
    poll = pollChannelNumber();

    if (current_channel === null) {
        if (ARGS.get("animate") == "true") {
            $("#hide").removeClass("animate").hide();
        }  
    }

    if (current_channel instanceof Channel) {
        if (poll != null && current_channel.number != poll) {
            console.log(`Channel has changed to ${poll}`);
    
            current_channel = channels[poll];
            updateChannel(current_channel);
    
            if (ARGS.get("animate") == "true") {
                $("#hide").show();
            }  
        } else if (poll === null) {
            current_channel = null;
        }
    }
}

function update() {
    if (!initFinished) {
        return;
    }
    
    let now = new Date();
    updateClock(now);

    isEpisodeUpdated = false;
    for (let [number, channel] of Object.entries(channels)) {
        if (!(channel instanceof Channel)) {
            continue;
        }

        if (channel.schedule.getLength() < 3) {
            for (let index = 0; index < (3 - channel.schedule.getLength()); index++) {
                episode_times = [];
                
                schedule_length = channel.schedule.getLength();
                episode_times = generateEpisodeTimes(channel, schedule_length === 0);

                episode = getEpisode(channel, episode_times);

                if (episode instanceof Episode) {
                    channel.addToSched(episode);
                }
            }
        }

        if (channel.schedule.getEpisode(0).end < now.getTime()) {
            channel.delFromSched(0);

            episode_times = generateEpisodeTimes(channel, false);

            episode = getEpisode(channel, episode_times);

            if (episode instanceof Episode) {
                channel.addToSched(episode);
            }

            if (current_channel != null && number === current_channel.number) {
                isEpisodeUpdated = true;
            }
        }
    }

    if (current_channel != null) {
        updateEpisodes(current_channel);
        updateProgressBar(current_channel, now);
    }
}

function init() {
    let global_json = doSimpleAjax("./data/json/global.json").responseJSON;
    channels["global"] = global_json;

    for (let value of global_json.index) {
        let json = {};
        $.ajax({
            'async': false,
            'type': "GET",
            'global': false,
            'url': "./data/json/channels/" + value + ".json",
            'success': function(data) {
                json = data;
            },
            'error': function() {
                console.log("Could not fetch channel json.");
            },
            'cache': false
        })

        channel = new Channel(json.name, json.number);

        if (json.logo == null) {
            channel.logo = global_json.logo;
        } else {
            channel.logo = json.logo;
        }

        channel.titles = json.episode.titles;
        channel.durations = json.episode.durations;
        channel.schedule = new Schedule();

        if (!(channel.number in channels)) {
            channels[channel.number] = channel;
        } else {
            console.log(`Channel number ${channel.number} already exists.`);
        }
    };

    if (ARGS.get("animate") === "true") {
        $("#hide").addClass("animate");
    }

    poll = pollChannelNumber();
    if (poll != null) {
        current_channel = channels[poll];
    }

    initFinished = true;
    update();
}
const DURATIONS = [30, 60, 90];

const TEMP_CHANNELS = [
    "ABC", "BBC", "CBC"
]

let channels = {};
chosen_channel = null;

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

function init() {
    // for (const [index, channelname] of TEMP_CHANNELS.entries()) {
    //     channel = new Channel(channelname, (index + 1));
    //     channel.durations = DURATIONS;
    //     channel.schedule = new Schedule();

    //     channels.push(channel);
    // }

    // chosen_channel = Math.floor(Math.random() * channels.length);

    console.log(ARGS.get("scene"));
    if (ARGS.get("scene") != null) {
        chosen_channel = ARGS.get("scene");
    } else {
        chosen_channel = "scene_monitor";
    }


    for (json of JSON_GLOBAL.channels) {
        channel = new Channel(json.name, json.number);

        if (json.logo == null) {
            channel.logo = JSON_GLOBAL.logo;
        } else {
            channel.logo = json.logo;
        }
        
        channel.titles = json.episode.titles;
        channel.durations = json.episode.durations;
        channel.schedule = new Schedule();

        channels[json.scene] = channel;
    }

    console.log(Object.entries(channels));

    update();
}

function update() {
    try {
        let now = new Date();
        updateClock(now);

        for (let [name, channel] of Object.entries(channels)) {
            console.log(name + ", " + channel)
            if (channel.schedule.getLength() < 3) {
                for (let index = 0; index < (3 - channel.schedule.getLength()); index++) {
                    episode_times = [];
                    
                    if (channel.schedule.getLength() == 0) {
                        episode_times = generateEpisodeTimes(channel, true);
                    } else {
                        episode_times = generateEpisodeTimes(channel, false); 
                    }

                    let episode_name = null;

                    let title_switch = Math.floor(Math.random() * 2);
                    if (title_switch == 0) {
                        episode_name = JSON_GLOBAL.episode.titles[Math.floor(Math.random() * JSON_GLOBAL.episode.titles.length)];
                    } else {
                        episode_name = channel.titles[Math.floor(Math.random() * channel.titles.length)]; 
                    }

                    let episode = new Episode(episode_name, episode_times[0], episode_times[1])
                    channel.addToSched(episode);
                }
            }

            if (channel.schedule.getEpisode(0).end < now.getTime()) {
                channel.delFromSched(0);

                episode_times = generateEpisodeTimes(channel, false);

                let episode_name = null;

                let title_switch = Math.floor(Math.random() * 2);
                if (title_switch == 0) {
                    episode_name = JSON_GLOBAL.episode.titles[Math.floor(Math.random() * JSON_GLOBAL.episode.titles.length)];
                } else {
                    episode_name = channel.titles[Math.floor(Math.random() * channel.titles.length)]; 
                }

                let episode = new Episode(episode_name, episode_times[0], episode_times[1]);
                channel.addToSched(episode);
            }
        }

        updateChannel(channels[chosen_channel]);
        updateEpisodes(channels[chosen_channel]);
        updateProgressBar(channels[chosen_channel], now);

    } catch(exc) {
        alert(exc.stack);
    }
}
const DURATIONS = [30, 60, 90];

const TEMP_CHANNELS = [
    "ABC", "BBC", "CBC"
]

channels = [];
chosen_channel = -1;

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

    episode_duration = DURATIONS[Math.floor(Math.random() * DURATIONS.length)];

    duration_hours = Math.floor(episode_duration / 60);
    duration_minutes = episode_duration % 60;

    time_end = time_start + (duration_hours*60*60*1000) + (duration_minutes*60*1000);

    return [time_start, time_end];
}

function init() {
    for (const [index, channelname] of TEMP_CHANNELS.entries()) {
        channel = new Channel(channelname, (index + 1));
        channel.durations = DURATIONS;
        channel.schedule = new Schedule();

        channels.push(channel);
    }

    chosen_channel = Math.floor(Math.random() * channels.length);

    update();
}

function update() {
    try {
        let now = new Date();
        updateClock(now);

        for (let channel of channels) {
            if (channel.schedule.getLength() < 3) {
                for (let index = 0; index < (3 - channel.schedule.getLength()); index++) {
                    episode_times = [];
                    
                    if (channel.schedule.getLength() == 0) {
                        episode_times = generateEpisodeTimes(channel, true);
                    } else {
                        episode_times = generateEpisodeTimes(channel, false); 
                    }

                    let episode = new Episode("Episode", episode_times[0], episode_times[1])
                    channel.addToSched(episode);
                }
            }

            if (channel.schedule.getEpisode(0).end < now.getTime()) {
                channel.delFromSched(0);

                episode_times = generateEpisodeTimes(channel, false);

                let episode = new Episode("Episode", episode_times[0], episode_times[1]);
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
const DURATIONS = [30, 45, 60, 90, 120];

function generateEpisodeTimes (isFirstEpisode=false) {
    time_start = 0;
    time_end = 0;

    if (isFirstEpisode) {
        let now = new Date();
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        time_start = now.valueOf();
    } else {
        time_start = Schedule.schedule[Schedule.schedule.length - 1].getEnd;
    }

    episode_duration = DURATIONS[Math.floor(Math.random() * DURATIONS.length)];

    duration_hours = Math.floor(episode_duration / 60);
    duration_minutes = episode_duration % 60;

    time_end = time_start + (duration_hours*60*60*1000) + (duration_minutes*60*1000);

    return [time_start, time_end];
}

function update() {
    try {
        let now = new Date();
        updateCurrentTime(now);
        updateCurrentDate(now);

        if (Schedule.schedule.length == 0) {
            for (let index = 0; index < 3; index++) {
                times = [];

                if (index == 0) {
                    times = generateEpisodeTimes(true);
                } else {
                    times = generateEpisodeTimes(false);
                }

                let episode = new Episode("Episode", times[0], times[1]);
                Schedule.add(episode);
            }
        }

        if (Schedule.schedule[0].end < now.getTime()) {
            Schedule.del(0);
            
            times = generateEpisodeTimes(false);

            let episode = new Episode("Episode", times[0], times[1]);
            Schedule.add(episode);
        }

        updateEpisodes();
        updateProgressBar(now);

    } catch(exc) {
        alert(exc);
    }
}
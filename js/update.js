function updateClock(now) {
    let options_time = {hour: "numeric", minute: "2-digit"};
    let options_date = {day: "2-digit", month: "2-digit", year: "numeric"};

    document.getElementById("currentTime").innerText = now.toLocaleTimeString({hc: "h12"}, options_time);
    document.getElementById("currentDate").innerText = now.toLocaleDateString('en-US', options_date);
}

function updateChannel(channel) {
    console.log(channel);
    document.getElementById("channelName").innerText = channel.name;
    document.getElementById("channelNumber").innerText = channel.number;
}

function updateEpisodes(channel) {
    schedule = channel.schedule;
    let options = {hour: "numeric", minute: "2-digit"};

    document.getElementById("currentEpisode").innerText = schedule.getEpisode(0).getName;
    document.getElementById("currentEpisodeTimes").innerText = schedule.getEpisode(0).toString();
    document.getElementById("currentEpisodeProgressTime").innerText = schedule.getEpisode(0).endTime.toLocaleTimeString({hc: "h12"}, options);

    document.getElementById("nextEpisode").innerText = schedule.getEpisode(1).getName;
    document.getElementById("nextEpisodeTimes").innerText = schedule.getEpisode(1).toString();
}

function updateProgressBar(channel, now) {
    episode = channel.schedule.getEpisode(0);

    time_start_seconds = Math.floor(episode.start/1000);
    time_end_seconds = Math.floor(episode.end/1000);

    time_current = now.getTime();
    time_current_seconds = Math.floor(time_current/1000);

    max = time_end_seconds - time_start_seconds;
    value = time_current_seconds - time_start_seconds;

    document.getElementById("currentEpisodeProgress").setAttribute("max", max);
    document.getElementById("currentEpisodeProgress").setAttribute("value", value);
}
function updateCurrentTime(now) {
    let options = {hour: "numeric", minute: "2-digit"};
    document.getElementById("currentTime").innerHTML = now.toLocaleTimeString({hc: "h12"}, options);
}

function updateCurrentDate(now) {
    let options = {day: "2-digit", month: "2-digit", year: "numeric"};
    document.getElementById("currentDate").innerHTML = now.toLocaleDateString('en-US', options);
}

function updateEpisodes() {
    episodes = Schedule.schedule;
    let options = {hour: "numeric", minute: "2-digit"};

    document.getElementById("currentEpisode").innerHTML = episodes[0].getName;
    document.getElementById("currentEpisodeTimes").innerHTML = episodes[0].toString();
    document.getElementById("currentEpisodeProgressTime").innerHTML = episodes[0].endTime.toLocaleTimeString({hc: "h12"}, options);

    document.getElementById("nextEpisode").innerHTML = episodes[1].getName;
    document.getElementById("nextEpisodeTimes").innerHTML = episodes[1].toString();
}

function updateProgressBar(now) {
    episode = Schedule.schedule[0];

    time_start_seconds = Math.floor(episode.start/1000);
    time_end_seconds = Math.floor(episode.end/1000);

    time_current = now.getTime();
    time_current_seconds = Math.floor(time_current/1000);

    max = time_end_seconds - time_start_seconds;
    value = time_current_seconds - time_start_seconds;

    document.getElementById("currentEpisodeProgress").setAttribute("max", max);
    document.getElementById("currentEpisodeProgress").setAttribute("value", value);
}
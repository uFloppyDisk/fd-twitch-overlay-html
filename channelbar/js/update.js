function updateClock(now) {
    let options_time = {hour: "numeric", minute: "2-digit"};
    let options_date = {day: "2-digit", month: "2-digit", year: "numeric"};

    $("#currentTime").text(now.toLocaleTimeString({hc: "h12"}, options_time));
    $("#currentDate").text(now.toLocaleDateString('en-US', options_date));
}

function updateChannel(channel) {
    $("#channelName").text(channel.name);
    $("#channelNumber").text(channel.number);

    if (channel.logo != null) {    
        $("#channelLogo").attr("src", channel.logo);
    }
}

function updateEpisodes(channel) {
    schedule = channel.schedule;
    let options = {hour: "numeric", minute: "2-digit"};

    $("#currentEpisode").text(schedule.getEpisode(0).getName);
    $("#currentEpisodeTimes").text(schedule.getEpisode(0).toString());
    $("#currentEpisodeProgressTime").text(schedule.getEpisode(0).endTime.toLocaleTimeString({hc: "h12"}, options));

    $("#nextEpisode").text(schedule.getEpisode(1).getName);
    $("#nextEpisodeTimes").text(schedule.getEpisode(1).toString());
}

function updateProgressBar(channel, now) {
    episode = channel.schedule.getEpisode(0);

    time_start_seconds = Math.floor(episode.start/1000);
    time_end_seconds = Math.floor(episode.end/1000);

    time_current = now.getTime();
    time_current_seconds = Math.floor(time_current/1000);

    max = time_end_seconds - time_start_seconds;
    value = time_current_seconds - time_start_seconds;

    $("#currentEpisodeProgress").attr("max", max);
    $("#currentEpisodeProgress").attr("value", value);
}
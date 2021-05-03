let enum_channel = [
    "subscribers",
    "donations",
    "followers",
    "music"
]

let enum_width = [
    "ep-width-1",
    "ep-width-2",
    "ep-width-3"
]

function trim(array, n) {
    if (array == null) 
        return void 0;
    if (n == null) 
        return array[array.length - 1];

    return array.slice(0, Math.max(n, 0));  
};

function getRoundedTime(offset=0, ts=null) {
    let timestamp = ts;
    let date = new Date();
    let ms_offset = offset * 1000;

    if (timestamp === null) {
        timestamp = date.getTime() + ms_offset;
        date.setTime(timestamp);
    } else {
        date.setTime(timestamp + ms_offset);
    }

    let half = "am";

    let hour = date.getHours();
    if (hour > 12) {
        hour = hour - 12;
        half = "pm";
    } else if (hour === 0) {
        hour = 12;
    } else if (hour === 12) {
        half = "pm";
    }

    let minute = date.getMinutes();
    if (minute >= 30) {
        minute = 30;
    } else {
        minute = "00";
    }

    return `${hour}:${minute}${half}`;
}

function addHeader(value, delete_old=false) {
    let elem = 
        $("<div>").append(
            $("<span>", {"class": "va-header timeslot", "text": value})
    );

    let jq_string = `.flex-container-header > div`;
    $(jq_string + ":last-child").after(elem);

    if (delete_old) {
        $(jq_string + ":nth-child(2)").remove();
    }
}

function addEpisode(value, channel, animate=false, width_override=0) {
    value = value.trim();
    
    if (value === null || value.length <= 3) {
        return false;
    }

    if (typeof channel === "number") {
        if (0 <= channel <= 3) {
            channel = enum_channel[channel];
        } else {
            channel = "null";
        }
    } else if (typeof channel === "string"){
        if (!(channel in enum_channel)) {
            channel = "null";
        }
    }

    let calc_width = -1;
    if (width_override != null) {
        calc_width = Math.floor(value.length / WIDTH_LIMIT);
        if (calc_width > 2) {
            calc_width = 2;
        }
    } else {
        calc_width = width_override;
    }

    let width = enum_width[calc_width];

    let html_classes = `episode ${width}`;
    if (animate) {
        html_classes = html_classes.replace(" ep-", " ");
        html_classes += " anim-start";
    }

    let objDiv = $("<div>", {"class": html_classes});
    objDiv.html(value);

    console.log(`Adding ${value} to ${channel} with episode width of ${calc_width+1}`);

    let jq_string = `#${channel} > div:first-child`;
    $(jq_string).before(objDiv);

    return true;
}
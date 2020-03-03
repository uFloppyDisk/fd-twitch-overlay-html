class Episode {
    name = "";

    start = -1;
    end = -1;
    startTime = null;
    endTime = null;

    duration = -1;

    constructor(name, start, end) {
        this.name = name;
        this.start = start;
        this.end = end;

        this.startTime = new Date();
        this.startTime.setTime(this.start);

        this.endTime = new Date();
        this.endTime.setTime(this.end);

        this.duration = this.end - this.start;
    }

    //#region Getters 

    get getName() {
        return this.name;
    }

    get getStart() {
        return this.start;
    }

    get getStartTime() {
        return this.startTime;
    }

    get getEnd() {
        return this.end;
    }

    get getEndTime() {
        return this.endTime;
    }

    get getDuration() {
        return this.duration;
    }

    //#endregion

    //#region Setters

    set setName(name) {
        this.name = name;
    }

    set setStart(start) {
        this.start = start;
    }

    set setStartTime(startTime) {
        this.startTime = startTime;
    }

    set setEnd(end) {
        this.end = end;
    }

    set setEndTime(endTime) {
        this.endTime = endTime;
    }

    set setDuration(duration) {
        this.duration = duration;
    }

    //#endregion

    toString() {
        let options = {hour: "numeric", minute: "2-digit"};

        let startTime = this.startTime.toLocaleTimeString({hc: "h12"}, options);
        let endTime = this.endTime.toLocaleTimeString({hc: "h12"}, options);

        return startTime + " - " +  endTime;
    }
}
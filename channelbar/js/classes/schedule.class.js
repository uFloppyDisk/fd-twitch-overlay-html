class Schedule {
    schedule = null;

    constructor(schedule=[]) {
        this.schedule = schedule;
    }

    get schedule() {
        return this.schedule;
    }

    set schedule(schedule) {
        this.schedule = schedule;
    }

    getLength() {
        return this.schedule.length;
    }

    getEpisode(index) {
        return this.schedule[index];
    }

    getNext() {
        return this.schedule.shift();
    }

    add(episode) {
        this.schedule.push(episode);
    }

    del(index, amount) {
        this.schedule.splice(index, amount);
    }
}
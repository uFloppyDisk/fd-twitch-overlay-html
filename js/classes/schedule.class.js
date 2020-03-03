class Schedule {
    static schedule = [];

    static get schedule() {
        return this.schedule;
    }

    static getNext() {
        return this.schedule.shift();
    }

    static add(episode) {
        this.schedule.push(episode);
    }

    static del(index) {
        this.schedule.splice(index, 1);
    }
}
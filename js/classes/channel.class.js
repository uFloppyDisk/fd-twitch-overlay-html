class Channel {

    name = "";
    number = -1;
    logo = null;

    titles = [];
    durations = [];

    schedule = null;

    constructor(name, number) {
        this.name = name;
        this.number = number;
    }

    //#region Getters

    get name() {
        return this.name;
    }

    get number() {
        return this.number;
    }

    get logo() {
        return this.logo;
    }

    get titles() {
        return this.titles;
    }

    get durations() {
        return this.durations;
    }

    get schedule() {
        return this.schedule;
    }

    //#endregion

    //#region Setters

    /**
     * @param {string} name
     */
    set name(name) {
        this.name = name;
    }

    /**
     * @param {int} number
     */
    set number(number) {
        this.number = number;
    }

    /**
     * @param {string} logo
     */
    set logo(logo) {
        this.logo = logo;
    }

    /**
     * @param {Array} titles
     */
    set titles(titles){
        this.titles = titles;
    }

    /**
     * @param {Array} durations
     */
    set durations(durations){
        this.durations = durations;
    }

    /**
     * @param {Schedule} schedule
     */
    set schedule(schedule) {
        this.schedule = schedule;
    }

    //#endregion

    addToSched(episode) {
        this.schedule.add(episode);
    }

    delFromSched(index, amount=1) {
        if (amount < 1) {
            amount = this.schedule.length;
        }

        this.schedule.del(index, amount);
    }
}
class Episode {
    constructor(title, ts=null) {
        this.title = title;
        this.ts = ts;

        if (this.ts === null) {
            this.ts = Date.now()
        }
    }

    getTitle() {
        return this.title;
    }

    getTimestamp() {
        return this.ts;
    }
}
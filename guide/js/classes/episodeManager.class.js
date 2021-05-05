let storage = new StorageManager();

class EpisodeManager {
    constructor() {
        this.channels = [];
    }

    init() {
        for (let i = 0; i < ENUM_CHANNELS.length; i++) {
            let channel_string = ENUM_CHANNELS[i];

            this.channels.push([]);

            try {
                let episodes_json = storage.getEntry(channel_string);
                let episodes = [];

                episodes_json.forEach(function(json, index) {
                    episodes.push(Object.assign(new Episode, json));
                });

                this.channels[i] = episodes;
            } catch (err) {
                if (err instanceof StorageException) {
                    console.warn(`Creating new entry for ${channel_string}`);
                    storage.createEntry(channel_string, []);
                } else {
                    throw err;
                }
            }

        }
    }

    _trim(channel) {
        this.channels[channel] = this.channels[channel].slice(0, Math.max(EPISODE_LIMIT, 0));
    }

    getChannels() {
        return this.channels;
    }

    getChannel(channel) {
        return this.channels[channel];
    }

    addEpisode(value, channel) {
        let channel_string = ENUM_CHANNELS[channel];

        if (this.channels[channel].length > 0 && this.channels[channel][0].getTitle() === value) {
            return false;
        }

        let episode = new Episode(value);
        this.channels[channel].unshift(episode);
        try {
            storage.updateEntry(channel_string, this.channels[channel]);

            if (this.channels[channel].length > EPISODE_LIMIT) {
                this._trim(channel);
            }

        } catch(err) {
            if (err instanceof StorageException) {
                console.error(err.message);
                this.channels[channel].shift();

                return false;
            } else {
                throw err;
            }
        } finally {
            return episode;
        }
    }
}
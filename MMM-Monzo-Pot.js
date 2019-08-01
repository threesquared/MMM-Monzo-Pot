Module.register('MMM-Monzo-Pot', {
    defaults: {
        updateInterval: 60 * 60 * 1000,
        clientId: '',
        clientSecret: '',
        redirectURI: 'http://127.0.0.1:8080/monzo-callback',
    },

    getTemplate() {
        return 'MMM-Monzo-Pot.njk';
    },

    getTemplateData() {
        return {
            loading: this.pots === undefined || this.pots.length === 0,
            pots: this.pots.map(pot => ({
                name: pot[1]._pot.name,
                balance: `£${pot[1]._pot.balance / 100}`,
            })),
        };
    },

    start() {
        this.pots = [];

        this.sendSocketNotification('SET_CONFIG', this.config);

        setInterval(() => {
            this.updateData();
        }, this.config.updateInterval);

        this.updateData();
    },

    updateData() {
        this.sendSocketNotification('GET_POT_DATA');
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'POT_DATA') {
            this.pots = JSON.parse(payload);
            this.updateDom();
        }
    },
});

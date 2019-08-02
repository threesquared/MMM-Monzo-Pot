const NodeHelper = require('node_helper');
const Monzo = require('monzo-js');
const fs = require('fs');

module.exports = NodeHelper.create({
    start() {
        this.moduleConfig = {};

        this.expressApp.get('/monzo-auth', (req, res) => {
            const { clientId, redirectURI } = this.moduleConfig;

            const token = Math.random().toString(36).substr(2, 5); // Verify this
            const url = `https://auth.monzo.com/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectURI)}&response_type=code&state=${token}`;

            res.redirect(url);
        });

        this.expressApp.get('/monzo-callback', (req, res) => {
            const { clientId, clientSecret, redirectURI } = this.moduleConfig;
            const authCode = req.query.code;

            Monzo.OAuth.usingAuthCode(clientId, clientSecret, redirectURI, authCode).then(({ refresh_token, access_token }) => {
                this.writeTokenData({
                    refreshToken: refresh_token,
                    accessToken: access_token,
                });

                res.send('Token file has been saved');
            }).catch((error) => {
                console.log(error); // Better error reporting
                res.send('Sorry something went wrong exchanging the authorization code, please try again');
            });
        });
    },

    refreshToken() {
        const { clientId, clientSecret } = this.moduleConfig;
        const { refreshToken } = this.getTokenData();

        Monzo.OAuth.refreshToken(clientId, clientSecret, refreshToken).then(({ refresh_token, access_token }) => {
            this.writeTokenData({
                refreshToken: refresh_token,
                accessToken: access_token,
            });
        }).catch((error) => {
            console.log('Could not refresh the Monzo token, please try to reauthenticate', error);
        });
    },

    writeTokenData(tokenData) {
        fs.writeFileSync('token.json', JSON.stringify(tokenData));
    },

    getTokenData() {
        if (!fs.existsSync('token.json')) {
            return false;
        }

        const data = fs.readFileSync('token.json');

        return JSON.parse(data);
    },

    getPotData() {
        const {
            accessToken,
        } = this.getTokenData();

        const monzo = new Monzo(accessToken);

        monzo.pots.all().then((pots) => {
            this.sendSocketNotification('POT_DATA', JSON.stringify([...pots]));
        }).catch(() => {
            if (accessToken) {
                this.refreshToken();
            }
        });
    },

    socketNotificationReceived(notification, payload) {
        if (notification === 'SET_CONFIG') {
            this.moduleConfig = payload;
        }

        if (notification === 'GET_POT_DATA') {
            this.getPotData();
        }
    },
});

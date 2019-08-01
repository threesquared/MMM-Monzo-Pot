# MMM-Monzo-Pot

This a module for [MagicMirror²](https://github.com/MichMich/MagicMirror).

This module gets the balance of your Pots from the [Monzo](https://monzo.com/) API and displays them in a table.

![Screenshot 2019-07-31 at 21 12 11](https://user-images.githubusercontent.com/892142/62244715-e900e000-b3d7-11e9-872f-dd1c4526769a.png)

## Installation

```bash
cd modules
git clone https://github.com/threesquared/MMM-Monzo-Pot.git
cd MMM-Monzo-Pot
npm install
```

## Authentication

> You will need to be able to access your MagicMirror in your browser so make sure your settings allow this!

First you need to create a new OAuth Client on the [Monzo developer portal](https://developers.monzo.com/). Copy the Client ID and Secret into your config. Also be sure to set it as a "confidential" app. Make sure the redirect url is set to your mirrors url plus `\monzo-callback`. For example:

```
http://192.168.0.170:8080/monzo-callback
```

Then you have to visit the authentication URL at the address of your mirror and follow the instructions to get your token:

```
http://192.168.0.170:8080/monzo-auth
```

## Config

The entry in `config.js` can include the following options:

| Option             | Description                                                                                                                                                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `clientId`         | **Required** This is the Client ID assigned to your Client on the Monzo Developer portal<br><br>**Type:** `string`
| `clientSecret`     | **Required** This is the Client Secret assigned to your Client on the Monzo Developer portal<br><br>**Type:** `string`
| `redirectURI`      | **Required** This is the `/monzo-callback` url on your MagicMirror<br><br>**Type:** `string`
| `updateInterval`   | How often the pot information is updated in ms.<br><br>**Type:** `integer`<br>**Default value:** `1 hour`

Here is an example of an entry in `config.js`

```js
{
    module: 'MMM-Monzo-Pot',
    header: 'Pots',
    position: 'bottom_left',
    config: {
        clientId: "$CLIENTID",
        clientSecret: "$CLIENTSECRET",
        redirectURI: "http://192.168.0.170:8080/monzo-callback",
    }
},
```

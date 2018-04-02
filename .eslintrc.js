module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules":{
        "indent": [2, "tab"],
        "no-tabs": 0,
        "no-console": 0,
        "func-names": ["error", "as-needed"],
        "new-cap": [0, {"newIsCap": true, "capIsNew": true}]
    }
};
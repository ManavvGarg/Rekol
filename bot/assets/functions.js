const { timeWords } = require("./words")

module.exports = {

firstUp: async function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
},

regFirstWords: async function(s, n) {
    // ?: non-capturing subsequent sp+word.Change {} if you want to require n instead of allowing fewer
    var a = s.match(new RegExp('[\\w\\.]+' + '(?:[\\s-]*[\\w\\.]+){0,' + (n - 1) + '}')); 
    return  (a === undefined || a === null) ? '' : a[0];
},

makeid: async function(length) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for(var i=0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
}

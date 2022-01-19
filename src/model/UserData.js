function UserData(lang, countries, topic, sources) {
    this.when = "24h";
    //String
    //This can be like fr
    if (lang != null) {
        this.lang = lang;
    } else {
        this.lang = "fr";
    }
    //String
    //This can be like US,FR or just FR
    this.countries = countries;
    //String
    this.topic = topic;
    //String
    //This can be like lemonde,rmc
    this.sources = sources;
}
exports.UserData = UserData;
var Faker = require('Faker');
var models = require('./models');
var db = require('./db');
var mongoose = require('mongoose');


for(var i = 0; i < 20; i++) {
    var user = new models.User({
        username: Faker.Name.findName(),
        password: '123',
        email: Faker.Internet.email(),
        registered: true
    });

    user.save();
}

for(var j = 0; j < 5; j++) {
    var tournament = new models.Tournament({
        title: Faker.Lorem.words()
    });

    tournament.save();
}

db.db.close();

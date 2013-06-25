var Faker = require('Faker');
var models = require('./models');
var db = require('./db');
var mongoose = require('mongoose');


for(var i = 0; i < 20; i++) {
    var user = new models.User({
        username: Faker.Internet.userName(),
        password: '123',
        email: Faker.Internet.email(),
        registered: true
    });

    user.save();
}

for(var j = 0; j < 5; j++) {
    var tournament = new models.Tournament({
        title: Faker.Name.firstName(),
        open: Math.round(Math.random()),
        users: []
    });

    tournament.save();
}

var admin = new models.User({
  username: "admin",
  password: "123",
  email: Faker.Internet.email(),
  registered: true,
  isAdmin: true
});
admin.save();

db.db.close();

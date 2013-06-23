var Faker = require('Faker');
var models = require('./models');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/matchsystem');
var db = mongoose.connection;

db.once('open', function callback () {
    for(var i = 0; i < 20; i++) {
        var user = new models.User({
            username: Faker.Name.findName(),
            password: '123',
            email: Faker.Internet.email(),
            registered: true
        });

        user.save();
    }

    db.close();
});

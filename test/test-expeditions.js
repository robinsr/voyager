/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    should = require('should'),
    request = require('supertest'),
    app = require('../server'),
    context = describe,
    User = mongoose.model('User'),
    Expedition = mongoose.model('Expedition'),
    agent = request.agent(app);

var TEST_EXPEDITION = {
    title: "Expedition Title",
    description: "An expedition",
    places: [{
        name: "Nested Test Place",
        longitude: "42.00",
        latidute: "-23.00",
        address: "1234 Test St Seattle WA 12345",
        images: [{
            src: "http://images.image.com",
            title: "A nice photo of Test Place"
        }],
        description: "Test Place is awesome!",
        placeId: null,
        interstitial: {
            travelMethod: "walking",
            description: "Walk four blocks south from previous place",
            cost: 00
        },
        order: 1
    }],
    tags: ["tag1,tag2"],
    images: [],
    popularity: null,
    score: null,
    user: null,
    comments: []
}
var TEST_EXPEDITION_INVALID = {
    title: "Expedition Title",
    description: "",
    places: [{
        name: "Nested Test Place",
        longitude: "42.00",
        latidute: "-23.00",
        address: "1234 Test St Seattle WA 12345",
        images: [{
            src: "http://images.image.com",
            title: "A nice photo of Test Place"
        }],
        description: "Test Place is awesome!",
        placeId: null,
        interstitial: {
            travelMethod: "walking",
            description: "Walk four blocks south from previous place",
            cost: 00
        },
        order: 1
    }],
    tags: ["tag1,tag2"],
    images: [],
    popularity: null,
    score: null,
    user: null,
    comments: []
}

var TEST_USER = {
    email: 'foobar@example.com',
    name: 'Foo bar',
    username: 'foobar',
    password: 'foobar'
}

var count;

/**
 * Articles tests
 */

describe('Expeditions', function() {
    before(function(done) {
        // create a user
        var user = new User(TEST_USER)
        user.save(done)
    })

    describe('GET /expeditions', function() {
        it('should respond with Content-Type text/html', function(done) {
            agent
                .get('/expeditions')
                .expect('Content-Type', /html/)
                .expect(200)
                .expect(/Expeditions/)
                .end(done)
        })
    })

    describe('GET /expeditions/new', function() {
        context('When not logged in', function() {
            it('should redirect to /login', function(done) {
                agent
                    .get('/expeditions/new')
                    .expect('Content-Type', /plain/)
                    .expect(302)
                    .expect('Location', '/login')
                    .expect(/Moved Temporarily/)
                    .end(done)
            })
        })

        context('When logged in', function() {
            before(function(done) {
                // login the user
                agent
                    .post('/users/session')
                    .field('email', 'foobar@example.com')
                    .field('password', 'foobar')
                    .end(done)
            })

            it('should respond with Content-Type text/html', function(done) {
                agent
                    .get('/expeditions/new')
                    .expect('Content-Type', /html/)
                    .expect(200)
                    .expect(/New Expedition/)
                    .end(done)
            })
        })
    })

    describe('POST /expeditions', function() {
        context('When not logged in', function() {
            it('should redirect to /login', function(done) {
                request(app)
                    .post('/expeditions')
                    .expect('Content-Type', /plain/)
                    .expect(302)
                    .expect('Location', '/login')
                    .expect(/Moved Temporarily/)
                    .end(done)
            })
        })

        context('When logged in', function() {
            before(function(done) {
                // login the user
                agent
                    .post('/users/session')
                    .field('email', 'foobar@example.com')
                    .field('password', 'foobar')
                    .end(done)
            })

            describe('Invalid parameters', function() {
                before(function(done) {
                    Expedition.count(function(err, cnt) {
                        count = cnt
                        done()
                    })
                })

                it('should respond with error', function(done) {
                    agent
                        .post('/expeditions')
                        .send(TEST_EXPEDITION_INVALID)
                        .expect('Content-Type', /application\/json/)
                        .expect(400)
                        .expect(/Path \`description\` is required/)
                        .end(done)
                })

                it('should not save to the database', function(done) {
                    Expedition.count(function(err, cnt) {
                        count.should.equal(cnt)
                        done()
                    })
                })
            })

            describe('Valid parameters', function() {
                before(function(done) {
                    Expedition.count(function(err, cnt) {
                        count = cnt
                        done()
                    })
                })

                it('should respond 200', function(done) {
                    agent
                        .post('/expeditions')
                        .send(TEST_EXPEDITION)
                        .expect('Content-Type', /application\/json/)
                        .expect(200)
                        .end(done)
                })

                it('should insert a record to the database', function(done) {
                    Expedition.count(function(err, cnt) {
                        cnt.should.equal(count + 1)
                        done()
                    })
                })

                it('should save the expedition to the database', function(done) {
                    Expedition
                        .findOne({
                            title: TEST_EXPEDITION.title
                        })
                        .populate('user')
                        .exec(function(err, article) {
                            should.not.exist(err)
                            should.exists(article, "Article was not saved to the database")
                            article.should.be.an.instanceOf(Expedition)
                            article.title.should.equal(TEST_EXPEDITION.title)
                            article.description.should.equal(TEST_EXPEDITION.description)
                            article.user.email.should.equal(TEST_USER.email)
                            article.user.name.should.equal(TEST_USER.name)
                            done()
                        })
                })
            })
        })
    })

    after(function(done) {
        require('./helper').clearDb(done)
    })
})
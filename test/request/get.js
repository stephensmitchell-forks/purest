
var fs = require('fs'),
    path = require('path');
var should = require('should');
var purest = require('../../lib/provider'),
    providers = require('../../config/providers'),
    refresh = require('../utils/refresh');


describe('get', function () {
    require('../utils/credentials');
    var cred = require('../../config/credentials');
    var p = {};
    before(function (done) {
        for (var name in providers) {
            var provider = providers[name];
            p[name] = new purest(provider.oauth
                ? {provider:name, key:cred.app[name].key, secret:cred.app[name].secret}
                : {provider:name});
        }
        done();
    });

    it('twitter', function (done) {
        p.twitter.get('users/show', {
            oauth:{token:cred.user.twitter.token, secret:cred.user.twitter.secret},
            qs:{screen_name:'mightymob'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.id.should.equal(1504092505);
            body.screen_name.should.equal('mightymob');
            done();
        });
    });
    it('linkedin', function (done) {
        p.linkedin.get('companies', {
            oauth:{token:cred.user.linkedin.token, secret:cred.user.linkedin.secret},
            qs:{'email-domain':'apple.com'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.values[0].id.should.equal(162479);
            body.values[0].name.should.equal('Apple');
            done();
        });
    });
    it('facebook', function (done) {
        p.facebook.get('me/groups', {
            qs:{access_token:cred.user.facebook.token, fields:'id,name'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data.length.should.equal(2);
            Object.keys(body.data[0]).length.should.equal(2);
            body.data[0].id.should.equal('313807222041302');
            body.data[0].name.should.equal('Facebook Developers');
            done();
        });
    });
    it('facebook fql', function (done) {
        p.facebook.get('fql', {
            qs:{
                access_token:cred.user.facebook.token,
                q:'SELECT friend_count FROM user WHERE uid = 100006399333306'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data[0].friend_count.should.equal(1);
            done();
        });
    });
    it('bitly', function (done) {
        p.bitly.get('bitly_pro_domain', {
            qs:{access_token:cred.user.bitly.token, domain:'nyti.ms'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.data.domain.should.equal('nyti.ms');
            body.data.bitly_pro_domain.should.equal(true);
            done();
        });
    });
    it('stocktwits', function (done) {
        p.stocktwits.get('streams/user/StockTwits', function (err, res, body) {
            if (err) return error(err, done);
            body.response.status.should.equal(200);
            body.messages.length.should.equal(30);
            done();
        });
    });
    it('soundcloud', function (done) {
        p.soundcloud.get('users', {
            qs:{oauth_token:cred.user.soundcloud.token, q:'thriftworks'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body[0].username.should.equal('Thriftworks');
            done();
        });
    });
    it('github', function (done) {
        p.github.get('users/simov', {
            qs:{access_token:cred.user.github.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.login.should.equal('simov');
            body.name.should.equal('simo');
            done();
        });
    });
    it('foursquare', function (done) {
        p.foursquare.get('users/81257627', {
            qs:{oauth_token:cred.user.foursquare.token, v:'20140503'}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.response.user.firstName.should.equal('Simo');
            done();
        });
    });
    it('stackexchange', function (done) {
        p.stackexchange.get('users', {
            qs:{
                key:cred.app.stackexchange.req_key,
                access_token:cred.user.stackexchange.token,
                site:'stackoverflow',
                sort:'reputation',
                order:'desc'
            }
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.items.length.should.equal(30);
            done();
        });
    });
    it('rubygems', function (done) {
        p.rubygems.get('gems/rails', function (err, res, body) {
            if (err) return error(err, done);
            body.name.should.equal('rails');
            body.platform.should.equal('ruby');
            done();
        });
    });
    it('coderbits', function (done) {
        p.coderbits.get('simov', function (err, res, body) {
            if (err) return error(err, done);
            body.username.should.equal('simov');
            done();
        });
    });
    it('wikimapia', function (done) {
        p.wikimapia.get('', {
            qs: {
                key:cred.app.wikimapia.req_key,
                function:'place.search',
                q:'Central Park, New York, NY',
                lat:'40.7629025',
                lon:'-73.9826439',
                format:'json'
            }
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.count.should.equal(5);
            done();
        });
    });
    it('openstreetmap', function (done) {
        p.openstreetmap.get('user/details', {
            // oauth for writing to the database
            oauth:{
                token:cred.user.openstreetmap.token,
                secret:cred.user.openstreetmap.secret
            }
            // or basic auth for reading user details
            // auth: {user:'email', pass:'password'}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.should.match(/<user id="\d+" display_name="\w+" account_created=".*">/);
            done();
        });
    });
    it('slack', function (done) {
        p.slack.get('users.list', {
            qs:{token:cred.user.slack.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.ok.should.equal(true);
            done();
        });
    });
    it('instagram', function (done) {
        p.instagram.get('users/self/feed', {
            qs:{access_token:cred.user.instagram.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            body.pagination.should.be.type('object');
            body.meta.code.should.equal(200);
            body.data.should.be.an.instanceOf(Array);
            done();
        });
    });
    it('flickr', function (done) {
        p.flickr.get('', {
            oauth:{token:cred.user.flickr.token, secret:cred.user.flickr.secret},
            qs:{
                method: 'flickr.people.findByUsername',
                api_key:cred.app.flickr.key,
                username:'obama',
                format:'json'
            }
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.stat.should.equal('ok');
            done();
        });
    });
    it('trello public', function (done) {
        p.trello.get('boards/4d5ea62fd76aa1136000000c', {
            qs:{key:cred.app.trello.key}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.name.should.equal('Trello Development');
            done();
        });
    });
    it('trello private', function (done) {
        p.trello.get('members/me/boards', {
            qs:{key:cred.app.trello.key, token:cred.user.trello.token}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.should.be.an.instanceOf(Array);
            done();
        });
    });
    describe('asana', function () {
        var access = {};
        before(function (done) {
            refresh.asana(function (err, res, body) {
                if (err) return done(err);
                access = {token:body.access_token};
                done();
            });
        });
        it('basic auth', function (done) {
            p.asana.get('users/me', {
                auth:{user:cred.user.asana.api_key, pass:''}
            }, function (err, res, body) {
                if (err) return error(err, done);
                should.deepEqual(Object.keys(body.data),
                    ['id','name','email','photo','workspaces']);
                done();
            });
        });
        it('oauth', function (done) {
            p.asana.get('users/me', {
                auth: {bearer:access.token}
            }, function (err, res, body) {
                if (err) return error(err, done);
                should.deepEqual(Object.keys(body.data),
                    ['id','name','email','photo','workspaces']);
                done();
            });
        });
    });
    it('mailchimp apikey', function (done) {
        p.mailchimp.get('campaigns/list', {
            qs:{apikey:cred.user.mailchimp.api_key}
        }, function (err, res, body) {
            if (err) return error(err, done);
            should.deepEqual(Object.keys(body),
                ['total','data','errors']);
            body.errors.length.should.equal(0);
            done();
        });
    });
    it('mailchimp oauth', function (done) {
        p.mailchimp.get('campaigns/list', {
            dc:cred.user.mailchimp.dc,
            qs:{apikey:cred.user.mailchimp.token}
        }, function (err, res, body) {
            if (err) return error(err, done);
            should.deepEqual(Object.keys(body),
                ['total','data','errors']);
            body.errors.length.should.equal(0);
            done();
        });
    });
    describe('heroku', function () {
        var access = {};
        before(function (done) {
            refresh.heroku(function (err, res, body) {
                if (err) return done(err);
                access = {token:body.access_token};
                done();
            });
        });
        it('', function (done) {
            p.heroku.get('account', {
                auth: {bearer:access.token}
                // or
                // auth: {user:'email', pass:'password'}
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.email.should.be.type('string');
                done();
            });
        });
    });
    it('dropbox', function (done) {
        p.dropbox.get('account/info', {
            auth: {bearer:cred.user.dropbox.token}
        }, function (err, res, body) {
            debugger;
            if (err) return error(err, done);
            body.email.should.be.type('string');
            done();
        });
    });

    describe('yahoo', function () {
        var access = {};
        before(function (done) {
            refresh.yahoo(function (err, res, body) {
                if (err) return done(err);
                access = {token:body.oauth_token, secret:body.oauth_token_secret};
                done();
            });
        });
        it('social', function (done) {
            p.yahoo.get('user/C6YWVTVM24O4SEGIIDLTWA5NUA/profile', {
                oauth:{
                    token:access.token, secret:access.secret
                },
                api:'social'
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.profile.nickname.should.equal('Simeon')
                done();
            });
        });
        it('yql', function (done) {
            p.yahoo.get('yql', {
                oauth:{
                    token:access.token, secret:access.secret
                },
                api:'yql',
                qs:{q:'SELECT * FROM social.profile WHERE guid=me'}
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.query.results.profile.nickname.should.equal('Simeon');
                done();
            });
        });
        it('geo', function (done) {
            p.yahoo.get("places.q('Central Park, New York')", {
                api:'geo',
                qs:{appid:cred.app.yahoo.req_key}
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.places.place[0].admin1.should.equal('New York');
                done();
            });
        });
    });

    describe('google', function () {
        var access = {};
        before(function (done) {
            refresh.google(function (err, res, body) {
                if (err) return done(err);
                access = {token:body.access_token};
                done();
            });
        });
        it('plus', function (done) {
            p.google.get('people/106189723444098348646', {
                api:'plus',
                qs:{
                    access_token:access.token
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.displayName.should.equal('Larry Page');
                done();
            });
        });
        it('youtube', function (done) {
            p.google.get('channels', {
                api:'youtube',
                qs:{
                    access_token:access.token,
                    part:'id, snippet, contentDetails, statistics, status, topicDetails',
                    forUsername:'RayWilliamJohnson'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.items[0].snippet.title.should.equal('RayWilliamJohnson');
                done();
            });
        });
        it('youtube/analytics', function (done) {
            p.google.get('reports', {
                api:'youtube/analytics',
                qs:{
                    access_token:access.token,
                    ids:'channel==UCar6nMFGfuv254zn5vDyVaA',
                    metrics:'views',
                    'start-date':'2014-01-15',
                    'end-date':'2014-02-15'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.rows.should.be.an.instanceOf(Array);
                done();
            });
        });
        it('drive', function (done) {
            p.google.get('about', {
                api:'drive',
                qs:{
                    access_token:access.token
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.user.isAuthenticatedUser.should.equal(true);
                done();
            });
        });
        it('freebase', function (done) {
            p.google.get('search', {
                api:'freebase',
                qs:{
                    access_token:access.token,
                    query:'Thriftworks'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.result[0].name.should.equal('Thriftworks');
                done();
            });
        });
        it('tasks', function (done) {
            p.google.get('users/@me/lists', {
                api:'tasks',
                qs:{
                    access_token:access.token
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.items[0].title.should.equal('Default List');
                done();
            });
        });
        it('urlshortener', function (done) {
            p.google.get('url', {
                api:'urlshortener',
                qs:{
                    key:cred.app.google.req_key,
                    shortUrl:'http://goo.gl/0wkZ4V'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.longUrl.should.equal('http://nodejs.org/');
                done();
            });
        });
        it('pagespeed', function (done) {
            p.google.get('runPagespeed', {
                api:'pagespeedonline',
                qs:{
                    key:cred.app.google.req_key,
                    url:'http://www.amazon.com/'
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.responseCode.should.equal(200);
                done();
            });
        });
        it('contacts', function (done) {
            p.google.get('contacts/default/full', {
                api:'contacts',
                qs:{
                    access_token:access.token,
                    'max-results':50
                }
            }, function (err, res, body) {
                debugger;
                if (err) return error(err, done);
                body.feed['openSearch$itemsPerPage']['$t'].should.equal('50');
                done();
            });
        });
    });
    
    describe('gmaps', function () {
        it('streetview', function (done) {
            p.gmaps.get('streetview', {
                qs:{
                    key:cred.app.google.req_key,
                    location:'40.7828647,-73.9653551',
                    size:'400x400',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                fs.writeFileSync('streetview.jpg', body, 'binary');
                done();
            });
        });
        it('staticmap', function (done) {
            p.gmaps.get('staticmap', {
                qs:{
                    key:cred.app.google.req_key,
                    center:'40.7828647,-73.9653551',
                    size:'640x640',
                    zoom:15,
                    format:'jpg',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                fs.writeFileSync('staticmap.jpg', body, 'binary');
                done();
            });
        });
        it('geocode', function (done) {
            p.gmaps.get('geocode/json', {
                qs:{
                    key:cred.app.google.req_key,
                    address:'Central Park, New York, NY',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.results[0].formatted_address
                    .should.equal('Central Park, New York, NY, USA');
                done();
            });
        });
        it('directions', function (done) {
            p.gmaps.get('directions/json', {
                qs:{
                    key:cred.app.google.req_key,
                    origin:'Central Park, New York, NY',
                    destination:'New York, New Jersey',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.routes[0].summary
                    .should.equal('79th Street Transverse and Central Park West');
                done();
            });
        });
        it('timezone', function (done) {
            p.gmaps.get('timezone/json', {
                qs:{
                    key:cred.app.google.req_key,
                    location:'40.7828647,-73.9653551',
                    timestamp:'1331161200',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.timeZoneName.should.equal('Eastern Standard Time');
                done();
            });
        });
        it('elevation', function (done) {
            p.gmaps.get('elevation/json', {
                qs:{
                    key:cred.app.google.req_key,
                    locations:'40.7828647,-73.9653551',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.results[0].elevation.should.equal(34.39545059204102);
                done();
            });
        });
        it('distancematrix', function (done) {
            p.gmaps.get('distancematrix/json', {
                qs:{
                    key:cred.app.google.req_key,
                    origins:'40.7828647,-73.9653551',
                    destinations:'40.7873463,-74.0108939',
                    sensor:false
                }
            }, function (err, res, body) {
                if (err) return error(err, done);
                body.rows[0].elements[0].distance.text.should.equal('11.8 km');
                body.rows[0].elements[0].duration.text.should.equal('21 mins');
                done();
            });
        });
        after(function () {
            fs.unlinkSync('staticmap.jpg');
            fs.unlinkSync('streetview.jpg');
        });
    });
});

function error (err, done) {
    return (err instanceof Error)
        ? done(err)
        : (console.log(err) || done(new Error('Network error!')));
}

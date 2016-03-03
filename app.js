var vueServer = require('vue-server');
var request = require('superagent');
var express = require('express');
var Vue = new vueServer.renderer();
var VueCompile = new vueServer.compiler();
var fs = require('fs');
var path = require('path');

var gameInfo = {
    load: function(id,callback){
        request
        .get('https://api.ecoolhub.com/api/games/info.json?id='+id)
        .end(callback);
    }
};
var gameList = {
    load: function(page,callback){
        request
        .get('https://api.ecoolhub.com/api/games/list.json?per_page=10&page='+page)
        .end(callback);
    }
};
var app = express();
app.use(express.static('public'));
app.get('/games/info/:id/:from',  function(request, response){
    var from = request.params.from;
    gameInfo.load(
        request.params.id,
        function(err, res){
            game = res.body.data;
            var relPath = 'components/games/info.vue';
            var gameView = new Vue({
                template: String(fs.readFileSync(path.join(__dirname, relPath))),
                data: {
                    game: game,
                    from: from
                }
            });
            gameView.$on('vueServer.htmlReady', function(html) {
                response.send(html);
            });
        });
});
app.get('/games/list/:page',  function(request, response){
    var page = request.params.page;
    gameList.load(
        page,
        function(err, res){
            games = res.body.data;
            var relPath = 'components/games/list.vue';
            var gameView = new Vue({
                template: String(fs.readFileSync(path.join(__dirname, relPath))),
                data: {
                    games: games,
                    page: page
                }
            });
            gameView.$on('vueServer.htmlReady', function(html) {
                response.send(html);
            });
        });
});
app.listen(3000);

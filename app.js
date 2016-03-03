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
function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (directoryExists(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function directoryExists(path) {
  try {
    return fs.statSync(path).isDirectory();
  }
  catch (err) {
    return false;
  }
}
app.use(express.static('public'));
app.get('/games/info/:id/:from',  function(request, response){
    var from = request.params.from;
    var id = request.params.id;
    gameInfo.load(
        id,
        function(err, res){
            var staticRelPath = 'statics/games/info/'+id+'.html';
            var staticPath = path.join(__dirname, staticRelPath);
            fs.exists(staticPath,function(exists){
                if(exists)
                    response.sendFile(staticPath);
                else{
                    var componentRelPath = 'components/games/info.vue';
                    var componentPath = path.join(__dirname, componentRelPath);
                    game = res.body.data;
                    var gameView = new Vue({
                        template: String(fs.readFileSync(componentPath)),
                        data: {
                            game: game,
                            from: from
                        }
                    });
                    gameView.$on('vueServer.htmlReady', function(html) {
                        response.send(html);
                        fs.writeFile(staticPath, html, { flags: 'wx' }, function (err) {
                            if (err) throw err;
                            console.log("static file saved:"+staticRelPath);
                        });
                    });
                }
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

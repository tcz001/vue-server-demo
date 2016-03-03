<ul id="games">
  <li v-for="game in games">
    <h1>{{game.name}}</h1>
    <div class="property">{{game.nick_name}}</div>
    <div class="property">{{game.language}}</div>
    <div class="property">{{game.release_at}}</div>
    <img src={{game.cover_small}}></img>
    <div class="property"><a href="/games/info/{{game.game_id}}/{{page}}">详情</a></div>
  </li>
</ul>
<div>
  <span v-for="n in 10">
    <a v-if="page-5+n > 0" href="/games/list/{{page-5+n}}"> {{page-5+n}}</a>
  </span>
</div>

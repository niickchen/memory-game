
const cardColors = ['yellow', 'red', 'blue', 'green', 'black', 'purple', 'pink', 'lightgrey', 'orange', 'cyan', 
  'darkblue', 'lightblue', 'lime', '#8fa800', 'olive', 'silver', '#01eebd', '#c34550', '#f79fdf', '#6f082b', '#52c73c',
  '#c1891b', '#188cb2', '#c8b5ec', '#38ec76', '#540bb8', '#b557f7', '#aaaaaa'];

function getColor (ctx) {
  let ind = ctx.request.body.ind + 1;
  if (!ind || !ctx.session.colors || ind > ctx.session.colors.length) ctx.badRequest('Error: invalid game or card index');
  else ctx.ok({ok: true, color: ctx.session.colors[ind-1]});
}

function getMaxScore(ctx) {
  ctx.ok({ok: true, max: ctx.session.maxScore || 0});
}

function setMaxScore(ctx) {
  let mx = ctx.request.body.max;
  if (!mx || isNaN(mx)) ctx.badRequest('Error: invalid max score');
  else {
    ctx.session.maxScore = Math.max(ctx.session.maxScore || 0, mx);
    ctx.ok({ok: true});
  }
}


// generate a new set of cards
function startNewGame(ctx) {
  let num = ctx.request.body.ind / 2 || 18;
  colors = generate(num).map(i => cardColors[i % cardColors.length]);
  ctx.session.colors = colors;
  ctx.body = {ok: true};
}

function generate(num) {
  for (var a = [], i = 0; i < num; ++i) {
    a[i * 2] = i;
    a[i * 2 + 1] = i;
  }
  a = shuffle(a);
  return a;
}

function shuffle(array) {
  var tmp, current, top = array.length;
  if(top) while(--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}

module.exports = {
  getColor,
  startNewGame,
  getMaxScore,
  setMaxScore,
};

console.clear();
let startingMoney = 14;
let players;
let biddingLogs;
let offeringLogs;

function parseLogs() {
  biddingLogs = [];
  offeringLogs = [];
  document.querySelectorAll('.log.log_replayable').forEach(dom => {
    const text = dom.innerText;
    const passesAndPaysText = ' passes and pays ';
    const winsTheRoundAndPaysText = ' wins the round and pays ';
    const forPropertyText = ' k$ for property ';
    const offersPropertyText = ' offers property ';
    if (text.indexOf(passesAndPaysText) >= 0) {
      const tmp = text.replace(passesAndPaysText, '\n').replace(forPropertyText, '\n').split('\n');
      const [user, bid, prop] =  tmp;
      biddingLogs.push({user, bid: parseInt(bid), prop: parseInt(prop)});
    } else if (text.indexOf(winsTheRoundAndPaysText) >= 0) {
      const tmp = text.replace(winsTheRoundAndPaysText, '\n').replace(forPropertyText, '\n').split('\n');
      const [user, bid, prop] =  tmp;
      biddingLogs.push({user, bid: parseInt(bid), prop: parseInt(prop)});
    } else if (text.indexOf(offersPropertyText) >= 0) {
      const tmp = text.replace(offersPropertyText, '\n').replace(' and receives the ', '\n').replace(' k$ card', '\n').split('\n');
      const [user, prop, price] = tmp;
      offeringLogs.push({user, prop, price: parseInt(price)});
    }
  });
  biddingLogs.sort((a, b) => a.prop < b.prop ? 1 : -1);
}

function displayLogs() {
  parseLogs();
  players = {};
  for (log of biddingLogs) {
    if (!players.hasOwnProperty(log.user)) players[log.user] = {money: startingMoney, props: []};

    const player = players[log.user];
    player.money -= log.bid;
    player.props.push(log.prop);
  }
  
  for (user in players) {
    const p = players[user];
    p['property list'] = p.props.toString();
    const total = p.props.reduce((v, c) => v + c, 0);
    p['value per dollar'] = parseFloat((total / (startingMoney - p.money)).toFixed(2));
  };

  console.clear();
  console.table(players, ['money', 'property list', 'value per dollar']);
}

function displayCards() {
  parseLogs();
  const cards = {};
  for (i = 1; i <= 30; i++) cards[i] = {};

  for ({user, bid, prop} of biddingLogs) cards[prop] = {user, bid};
  for ({user, prop, price} of offeringLogs) cards[prop] = {...cards[prop], price};

  console.clear();
  console.table(cards, ['user', 'price']);
}

function l() {
  displayLogs();
}

function c() {
  displayCards();
}

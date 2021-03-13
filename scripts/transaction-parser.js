let data = require("./data/trades-formatted");
let debug_output = [];
let trades = data.trades;
let formatted_output = {};

for (let ticker in trades) {
    if (!formatted_output[ticker])
        formatted_output[ticker] = {
            openPositions: { Shares: 0 },
            transactions: []
        };
    let ticker_trades = trades[ticker];
    let positions = formatted_output[ticker].openPositions;
    let transactions = formatted_output[ticker].transactions;

    let share_transaction = [];
    let option_transaction = [];

    ticker_trades.sort((a, b) => {
        if (a.date == b.date) return 0;
        return new Date(a.date) > new Date(b.date) ? 1 : -1;
    });
    for (let trade of ticker_trades) {
        if (trade.type == "Buy") {
            positions.Shares += parseInt(trade.quantity);
            share_transaction.push(trade);

            if (positions.Shares == 0) {
                transactions.push(share_transaction);
                share_transaction = [];
            }
        } else if (trade.type == "Sell") {
            positions.Shares -= parseInt(trade.quantity);
            share_transaction.push(trade);
            if (positions.Shares == 0) {
                transactions.push(share_transaction);
                share_transaction = [];
            }
        } else if (trade.type == "Buy Call" || trade.type == "Buy Put") {
            const id = `${trade.strike}${trade.type[4]}${trade.expiry}`;
            if (!positions[id]) positions[id] = 0;
            positions[id] += parseInt(trade.quantity);
            option_transaction.push(trade);
            if (positions[id] == 0) delete positions[id];
        } else if (trade.type == "Sell Call" || trade.type == "Sell Put") {
            const id = `${trade.strike}${trade.type[5]}${trade.expiry}`;
            if (!positions[id]) positions[id] = 0;
            positions[id] -= parseInt(trade.quantity);
            option_transaction.push(trade);
            if (positions[id] == 0) delete positions[id];
        } else if (trade.type == "Call Expiry" || trade.type == "Put Expiry") {
            const id = `${trade.strike}${trade.type[0]}${trade.expiry}`;
            const negative = positions[id] > 0 ? -1 : 1;

            positions[id] += negative * parseInt(trade.quantity);
            option_transaction.push(trade);
            if (positions[id] == 0) delete positions[id];
        } else if (trade.type == "Call Assignment") {
            const id = `${trade.strike}C${trade.expiry}`;
            if (!positions[id]) console.log(`Error parsing ${trade}`);
            positions[id] += parseInt(trade.quantity);
            option_transaction.push(trade);

            if (positions[id] == 0) delete positions[id];
            else console.log(`Warning: ${id} still open after call assignment`);
        } else if (trade.type == "Call Exercise") {
            let id;
            for (let prop in positions) {
                if (prop != "Shares") {
                    if (positions[prop] == parseInt(trade.quantity)) {
                        console.log(`Replaced: ${trade.expiry} with ${prop}`);
                        id = prop;
                        break;
                    }
                }
            }
            if (!id)
                console.log(
                    `Error finding calls to exercise for ${JSON.stringify(
                        trade
                    )}`
                );
            else {
                option_transaction.push(trade);
                positions[id] -= trade.quantity;
                delete positions[id];
            }
        } else {
            console.log(`Trade ${trade.type} not yet supported`);
        }
        if (
            Object.keys(positions).length == 1 &&
            option_transaction.length != 0
        ) {
            transactions.push(option_transaction);
            option_transaction = [];
        }
    }
}

for (let [ticker, data] of Object.entries(formatted_output)) {
    if (Object.keys(data.openPositions).length != 1) {
        log(ticker);
        log(data.openPositions);
    }
}

let fs = require("fs");

fs.writeFile(
    "scripts/data/transactions.json",
    JSON.stringify(formatted_output, null, 2),
    (err) => {
        if (err) console.log(err);
    }
);

function log(data) {
    debug_output.push(data);
}
fs.writeFile(
    "scripts/data/debug_output.json",
    JSON.stringify(debug_output, null, 2),
    (err) => {
        if (err) console.log(err);
    }
);

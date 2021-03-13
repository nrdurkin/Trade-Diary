let trades = require("./data/trades");

let withdrawals = [];
let deposits = [];
let tickerData = {};

let debug_output = [];

for (let trade of trades) {
    if (trade.description.substring(0, 10) == "Withdrawal") {
        if (trade.summary.Status == "Completed") {
            withdrawals.push({
                amount: parseFloat(
                    trade.summary.Amount.slice(1).replace(",", "")
                ),
                date: trade.summary.Initiated
            });
        }
    } else if (trade.description.substr(0, 7) == "Deposit") {
        if (trade.summary.Status == "Completed") {
            deposits.push({
                amount: parseFloat(
                    trade.summary.Amount.slice(1).replace(",", "")
                ),
                date: trade.summary.Initiated
            });
        }
    } else if (trade.description.substr(0, 8) == "Dividend") {
        //TODO: Handle Dividends
    } else if (trade.description.slice(-15) == "Calendar Spread") {
        if (trade.legs.length != 2)
            console.log(`Trade: ${trade.description} does not have 2 legs.`);
        else {
            for (let leg of trade.legs) parseLeg(leg);
        }
    } else if (trade.description.slice(-10) == "Expiration") {
        let ticker = trade.description.split(" ")[0];
        let type = `${trade.description.split(" ")[2]} Expiry`;
        let quantity = trade.summary.Contracts.replace(",", "");
        if (parseInt(quantity) != quantity)
            console.log(`${trade.description} failed to parse`);
        let date = trade.summary.Date;
        let strike = trade.description
            .split(" ")[1]
            .slice(1)
            .replace(",", "");
        if (parseFloat(strike) != strike)
            console.log(`${trade.description} failed to parse`);
        if (!tickerData[ticker]) tickerData[ticker] = [];
        tickerData[ticker].push({
            date: date,
            type: type,
            strike: strike,
            expiry: date,
            price: 0,
            quantity: quantity
        });
    } else if (
        trade.description.slice(-10) == "Market Buy" ||
        trade.description.slice(-9) == "Limit Buy"
    ) {
        if (trade.summary.Status == "Filled") {
            parseShares(trade, "Buy");
        }
    } else if (
        trade.description.slice(-11) == "Market Sell" ||
        trade.description.slice(-10) == "Limit Sell"
    ) {
        if (trade.summary.Status == "Filled") {
            parseShares(trade, "Sell");
        }
    } else if (
        trade.description.slice(-13) == "Credit Spread" ||
        trade.description.slice(-12) == "Debit Spread" ||
        trade.description.slice(-14) == "2-Option Order"
    ) {
        if (trade.summary.Status == "Filled") {
            for (let leg of trade.legs) parseLeg(leg);
        } else {
            // console.log(trade);
            if (trade.legs.length > 0)
                for (let leg of trade.legs) parseLeg(leg);
        }
    } else if (
        (trade.description.split(" ")[4] == "Buy" ||
            trade.description.split(" ")[4] == "Sell") &&
        (trade.description.split(" ")[2] == "Call" ||
            trade.description.split(" ")[2] == "Put")
    ) {
        parseLeg(trade);
    } else if (
        trade.description.slice(-15) == "Call Assignment" ||
        trade.description.slice(-13) == "Call Exercise"
    ) {
        const ticker = trade.description.split(" ")[0];
        const quantity = trade.summary.Contracts.replace(",", "");
        const date = trade.summary.Date;
        const strike = trade.description.split(" ")[1].slice(1);
        if (strike != parseFloat(strike))
            console.log(`${trade.description} couldn't be parsed`);
        const type =
            trade.description.slice(-15) == "Call Assignment"
                ? "Call Assignment"
                : "Call Exercise";
        if (!tickerData[ticker]) tickerData[ticker] = [];
        tickerData[ticker].push({
            date: date,
            type: type,
            strike: strike,
            quantity: quantity,
            expiry: date
        });
    } else if (trade.description == "Bonus stock from Robinhood") {
        const ticker = trade.summary.Description.split(" ")[3];
        const date = parseWordDate(trade.summary.Date);
        if (!tickerData[ticker]) tickerData[ticker] = [];
        tickerData[ticker].push({
            date: date,
            type: "Buy",
            price: 0,
            quantity: 1
        });
    } else {
        console.log(`${JSON.stringify(trade)} could not be handled`);
    }
}

log(tickerData["SPY"]);

function parseLeg(leg) {
    if (leg.description.split(" ").length == 6) {
        //has quantity in description
        leg.description = leg.description
            .split(" ")
            .slice(1)
            .join(" ");
    } else if (leg.description.split(" ")) {
        //no quantity in description
    }
    const ticker = leg.description.split(" ")[0];
    const b_s = leg.description.split(" ")[4];
    const c_p = leg.description.split(" ")[2];
    const type = `${b_s} ${c_p}`;

    let date = parseWordDate(
        leg.summary.Filled.split(",")
            .slice(0, 2)
            .join(",")
    );

    let strike = leg.description
        .split(" ")[1]
        .slice(1)
        .replace(",", "");
    if (parseFloat(strike) != strike)
        console.log(`${JSON.stringify(leg)} can't be resolved`);

    let price = leg.summary["Filled Quantity"]
        .split(" ")[3]
        .slice(1)
        .replace(",", "");
    if (parseFloat(price) != price)
        console.log(`${JSON.stringify(leg)} can't be resolved`);

    let quantity = leg.summary["Filled Quantity"]
        .split(" ")[0]
        .replace(",", "");
    if (parseInt(quantity) != quantity)
        console.log(`${JSON.stringify(leg)} can't be resolved`);

    let expiry = leg.description.split(" ")[3];

    if (expiry.split("/").length != 3) {
        const filled = new Date(
            leg.summary.Filled.split(",")
                .slice(0, 2)
                .join(",")
        );
        const alt1 = `${expiry}/${filled.getFullYear()}`;
        const alt2 = `${expiry}/${filled.getFullYear() + 1}`;
        expiry = filled <= new Date(alt1) ? alt1 : alt2;
    }

    if (!tickerData[ticker]) tickerData[ticker] = [];
    tickerData[ticker].push({
        date: date,
        type: type,
        strike: strike,
        expiry: expiry,
        price: price,
        quantity: quantity
    });
}

function parseShares(trade, type) {
    let ticker = trade.summary.Symbol;
    let date = parseWordDate(trade.summary.Submitted);
    let quantity = trade.summary["Filled Quantity"]
        .split(" ")[0]
        .replace(",", "");
    if (quantity != parseInt(quantity))
        console.log(`${trade.description} failed to parse`);
    let price = trade.summary["Filled Quantity"]
        .split(" ")[3]
        .slice(1)
        .replace(",", "");
    if (price != parseFloat(price))
        console.log(`${trade.description} failed to parse`);
    if (!tickerData[ticker]) tickerData[ticker] = [];
    tickerData[ticker].push({
        date: date,
        type: type,
        price: price,
        quantity: quantity
    });
}

function parseWordDate(date) {
    const parts = date.split(" ");
    const mon =
        [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ].indexOf(parts[0]) + 1;
    const day = parts[1].slice(0, -1);
    const year = parts[2];
    return `${mon}/${day}/${year}`;
}

let fs = require("fs");
const { PassThrough } = require("stream");
fs.writeFile(
    "scripts/data/trades-formatted.json",
    JSON.stringify(
        {
            deposits: deposits,
            withdrawals: withdrawals,
            trades: tickerData
        },
        null,
        2
    ),
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

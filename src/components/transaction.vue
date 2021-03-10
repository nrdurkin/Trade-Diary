<template>
    <div class="transaction">
        <div class="ticker">{{ ticker }}</div>
        <div class="date">{{ date }}</div>
        <div class="type">{{ type }}</div>
        <div class="strike">{{ strike | money }}</div>
        <div class="price">{{ price | money }}</div>
        <div class="quantity">{{ quantity }}</div>
        <div class="total">{{ total | money }}</div>
        <div class="net">{{ net | money }}</div>
    </div>
</template>

<script>
export default {
    props: ["obj"],
    data() {
        if (this.obj) return this.obj;
        return {
            ticker: "Ticker",
            date: "Date",
            type: "Type",
            strike: "Strike",
            price: "Price",
            quantity: "Quantity",
            total: "Total",
            net: "Net"
        };
    }
};
</script>

<style lang="less" scoped>
.transaction {
    display: flex;
    flex-direction: row;
    min-width: 500px;
    max-width: 900px;
    div {
        min-width: 80px;
        margin-left: 4px;
    }
    .ticker,
    .date {
        flex: 10%;
    }
    .type,
    .strike {
        flex: 15%;
    }
    .price,
    .quantity,
    .total,
    .net {
        flex: 12.5%;
    }
}
</style>

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateProductPrice = calculateProductPrice;
function calculateProductPrice(product, rates) {
    if (product.priceType === 'FIXED' &&
        product.fixedPrice !== null) {
        return Number(product.fixedPrice);
    }
    if (product.netWeight === null ||
        product.metalType === null ||
        product.purity === null) {
        return 0;
    }
    const rate = rates.find((item) => item.metal === product.metalType &&
        item.purity === product.purity);
    if (!rate) {
        return 0;
    }
    const metalValue = Number(product.netWeight) * Number(rate.rate);
    const makingCharge = Number(product.makingCharge ?? 0);
    const stoneCharge = Number(product.stoneCharge ?? 0);
    return metalValue + makingCharge + stoneCharge;
}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionPool = exports.getTransactionPool = exports.addToTransactionPool = void 0;
const lodash_1 = __importDefault(require("lodash"));
const transaction_1 = require("./transaction");
let transactionPool = [];
const getTransactionPool = () => {
    return lodash_1.default.cloneDeep(transactionPool);
};
exports.getTransactionPool = getTransactionPool;
const addToTransactionPool = (tx, unspentTxOuts) => {
    if (!(0, transaction_1.validateTransaction)(tx, unspentTxOuts)) {
        throw Error('Trying to add invalid tx to pool');
    }
    if (!isValidTxForPool(tx, transactionPool)) {
        throw Error('Trying to add invalid tx to pool');
    }
    console.log('adding to txPool: %s', JSON.stringify(tx));
    transactionPool.push(tx);
};
exports.addToTransactionPool = addToTransactionPool;
const hasTxIn = (txIn, unspentTxOuts) => {
    const foundTxIn = unspentTxOuts.find((uTxO) => {
        return uTxO.txOutId === txIn.txOutId && uTxO.txOutIndex === txIn.txOutIndex;
    });
    return foundTxIn !== undefined;
};
const updateTransactionPool = (unspentTxOuts) => {
    const invalidTxs = [];
    for (const tx of transactionPool) {
        //@ts-ignore
        for (const txIn of tx.txIns) {
            if (!hasTxIn(txIn, unspentTxOuts)) {
                invalidTxs.push(tx);
                break;
            }
        }
    }
    if (invalidTxs.length > 0) {
        console.log('removing the following transactions from txPool: %s', JSON.stringify(invalidTxs));
        transactionPool = lodash_1.default.without(transactionPool, ...invalidTxs);
    }
};
exports.updateTransactionPool = updateTransactionPool;
const getTxPoolIns = (aTransactionPool) => {
    return (0, lodash_1.default)(aTransactionPool)
        .map((tx) => tx.txIns)
        .flatten()
        .value();
};
const isValidTxForPool = (tx, aTtransactionPool) => {
    const txPoolIns = getTxPoolIns(aTtransactionPool);
    const containsTxIn = (txIns, txIn) => {
        return lodash_1.default.find(txPoolIns, ((txPoolIn) => {
            return txIn.txOutIndex === txPoolIn.txOutIndex && txIn.txOutId === txPoolIn.txOutId;
        }));
    };
    //@ts-ignore
    for (const txIn of tx.txIns) {
        if (containsTxIn(txPoolIns, txIn)) {
            console.log('txIn already found in the txPool');
            return false;
        }
    }
    return true;
};

const mongoose = require('mongoose')

const creditAccountSchema = new mongoose.Schema({
  type: String,
  bank: String,
  accountNumber: Number,
  address: String,
  amountOverdue: Number,
  currentBalance: Number,
});

const creditReportSchema = new mongoose.Schema({
    name: String,
    mobile: String,
    pan: String,
    creditScore: Number,
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalance: Number,
    securedAmount: Number,
    unsecuredAmount: Number,
    last7DaysEnquiries: Number,
    creditAccounts:[creditAccountSchema]
},{versionKey:false})
const CreditReportModel = mongoose.model('creditReport',creditReportSchema)

module.exports = CreditReportModel
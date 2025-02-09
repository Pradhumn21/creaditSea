const mongoose = require('mongoose')

const connection = mongoose.connect(process.env.mongodb_url)
module.exports = {connection}
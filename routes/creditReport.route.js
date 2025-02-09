const express = require('express')
const CreditReportModel = require('../models/creditReport.model')
const creditRoute  = express.Router()

 creditRoute.get('/reports',async(req,res)=>{
  try {
    const report = await CreditReportModel.find()
    res.send(report)
  } catch (error) {
    res.status(500).send({error:'failed to fetch report'})
  }
 })

  module.exports = creditRoute
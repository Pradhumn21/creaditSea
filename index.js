require('dotenv').config()
const express = require('express')
const {connection} = require('./dbconfig')
const cors = require('cors')
const upload = require('./middlewares/multer')
const{XMLParser} = require('fast-xml-parser')
const CreditReportModel = require('./models/creditReport.model')

const server = express()
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["*"];

server.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

server.use(express.json())

 server.post('/uploadFile',upload.single('xmlFile'),async(req,res)=>{
   const xmlFile = req.file;
    const xmlData = xmlFile.buffer.toString("utf8");
    try {
       const parser = new XMLParser()
       const parsedData = parser.parse(xmlData)
       const{CreditReport:{BasicDetails,ReportSummary,CreditAccounts}} = parsedData

       const formattedCreditAccounts = Array.isArray(CreditAccounts.Account)
       ? CreditAccounts.Account.map(account => ({
           type: account.Type,
           bank: account.Bank,
           accountNumber: account.AccountNumber,
           address: account.Address,
           amountOverdue: account.AmountOverdue,
           currentBalance: account.CurrentBalance
       }))
       : [];

       const report = new CreditReportModel({
         name: BasicDetails.Name,
         mobile: BasicDetails.MobilePhone,
         pan: BasicDetails.PAN,
         creditScore: BasicDetails.CreditScore,
         totalAccounts: ReportSummary.TotalAccounts,
         activeAccounts: ReportSummary.ActiveAccounts,
         closedAccounts: ReportSummary.ClosedAccounts,
         currentBalance: ReportSummary.CurrentBalance,
         securedAmount: ReportSummary.SecuredAccountsAmount,
         unsecuredAmount: ReportSummary.UnsecuredAccountsAmount,
         last7DaysEnquiries: ReportSummary.Last7DaysCreditEnquiries,
         creditAccounts: formattedCreditAccounts
       })
       await report.save()
      res.status(200).send({msg:'file uploaded and data stored, to see data go back and refresh page'})
   } catch (error) {
      res.status(500).send({error:'server error',error})
   }
})

server.get('/reports',async(req,res)=>{
   try {
     const report = await CreditReportModel.find()
     res.send(report)
   } catch (error) {
     res.status(500).send({error:'failed to fetch report'})
   }
  })

  server.get('/',(req,res)=>{
    res.send({msg:'this is checking route'})
  })


server.listen(process.env.PORT,async()=>{
 try {
    await connection
    console.log('db connected successfully and server is running fine')
 } catch (error) {
    console.log(error)
 }
})
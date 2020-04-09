//for copy and zip folders
const fsExtra = require("fs-extra"),
    glob = require('glob'),
    zipper = require('zip-local'),
    mainFolder = __dirname + '/AT&T-Ready/'

//for change innerHTML
const fs = require('fs'),
    path = require('path')

//for Google Sheet API
const {
    google
} = require('googleapis')
const keys = require('./keys.json')
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
)

client.authorize(async function (err, tokens) {

    if (err) {
        console.log(err)
        return
    } else {
        console.log('Connected!')
        const data = await gsRun(client)

        await mainProcess(data)
        console.log('Well done!')
    }
})

//all work with fileSystem
function mainProcess(data) {
    const dateNow = new Date()
    const options = {
        month: 'long',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }
    const stringDateNow = dateNow.toLocaleString("en-US", options).replace(/:/g, '-')
    const modifiedCreativesFolder = mainFolder + 'Modified creatives/'
    const readyFolder = mainFolder + 'Ready for upload/'
    const dateNowFolder = readyFolder + stringDateNow
    
    //create a directory if it doesn't exist and if data isn't empty
    if (data.length > 0) {
        if (!fs.existsSync(mainFolder)) {
            fs.mkdirSync(mainFolder)
        }
    }

    //create a directory if it doesn't exist
    if (!fs.existsSync(modifiedCreativesFolder)) {
        fs.mkdirSync(modifiedCreativesFolder)
    }

    if (!fs.existsSync(readyFolder)) {
        fs.mkdirSync(readyFolder)
    }

    fs.mkdirSync(dateNowFolder)

    // copy source folder (template) to destination with content and change innerHtml by data
    // split data by arrays
    data.forEach( property => {
        let [propertyName, startDate, time, endDate, spaceName, distinction, event] = property

        if (event === 'Bring your Bill' || event === 'Breakfast on the Go' || event === 'Pizza Party') return

        //formatted string example: from => 'February 14th, 2020' to => 'February 14'
        const formattedEndDate = endDate.split(' ')[0] + ' ' + parseInt(endDate.split(' ')[1]),
            formattedTime = formattingTime(time),
            nameOfZipsAndBackups = `Event_Driven_${formattedEndDate}_${propertyName}_`

        const copiedFolderPromise = new Promise((resolve, reject) => {
            resolve(copyFoldersChangeHtmls(propertyName, spaceName, formattedTime, formattedEndDate, distinction, modifiedCreativesFolder, event))
        })

        copiedFolderPromise.then(copiedFolder => {
            zipCreativesCopyBackups(dateNowFolder, copiedFolder, startDate, propertyName, distinction, nameOfZipsAndBackups, event)
        })
    })
}

function zipCreativesCopyBackups(readyFolder, copiedFolder, startDate, propertyName, distinction, nameOfZipsAndBackups, event) {
    let nameReadyFolder = `${startDate}_${propertyName}`

    //if there is a distinction then change name of folder
    distinction ? nameReadyFolder = `${nameReadyFolder}(${distinction})` : nameReadyFolder = nameReadyFolder

    const readyFolderPath = path.resolve(readyFolder, nameReadyFolder)
    fs.mkdirSync(readyFolderPath)

    //zip folders
    fs.readdirSync(copiedFolder).forEach(subFolder => {
        const subFolderZipPath = path.resolve(copiedFolder, subFolder)

        if (fs.statSync(subFolderZipPath).isDirectory()) {
            const copiedSubFolder = path.resolve(readyFolderPath, nameOfZipsAndBackups) + subFolder + '.zip'

            zipper.sync.zip(subFolderZipPath).compress().save(copiedSubFolder)
        }
    })

    event === 'AT&T TV' ? event = 'TV' : event = 'Generic'

    const templateBackupsFolder = __dirname + '/BACKUPS/' + event
    //copy backups
    fs.readdirSync(templateBackupsFolder).forEach(backupTemplate => {
        const subFolderBackupPath = path.resolve(templateBackupsFolder, backupTemplate)
        const copiedBackup = path.resolve(readyFolderPath, nameOfZipsAndBackups) + backupTemplate

        fs.copyFileSync(subFolderBackupPath, copiedBackup)
    })
}

//formatted string example: from => '5:30 AM - 8:00 PM' to => '5:30am - 8pm'
function formattingTime(str) {
    let formattedTime = str.replace(/:00/g, "").replace(/ PM/g, "pm").replace(/ AM/g, "am")

    //check and replace duplicate in row
    if (formattedTime.match(/am.*am/)) { // Check if there are 2 'am'
        formattedTime = formattedTime.replace('am', '') // Remove the first one
    } else if (formattedTime.match(/pm.*pm/)) { // Check if there are 2 'pm'
        formattedTime = formattedTime.replace('pm', '') // Remove the first one
    }
    return formattedTime
}

// copy source folder (template) to destination with content and change innerHtml by data
function copyFoldersChangeHtmls(destination, text1, text2, text3, distinction, modifiedCreativesFolder, event) {
    event === 'AT&T TV' ? event = 'TV' : event = 'Generic'

    const templateOfCreativesFolder = __dirname + '/TEMPLATE/' + event
    let nameOfCopiedFolder = modifiedCreativesFolder

    //if propertyName is repeating in the data - add distinction in their name
    if (distinction) {
        nameOfCopiedFolder = nameOfCopiedFolder + destination + `(${distinction})`
    } else {
        nameOfCopiedFolder = nameOfCopiedFolder + destination
    }

    try {
        //deep copy folder from template and rename by data
        fsExtra.copySync(templateOfCreativesFolder, nameOfCopiedFolder)
        //find all html files and replace innerHtml in them
        glob.sync(nameOfCopiedFolder + '/**/*.html').forEach(file => {
            changeInnerHtml(text1, text2, text3, file)
        })
    } catch (err) {
        console.error(err)
    }
    return nameOfCopiedFolder
}

//get data from current Google Sheet
async function gsRun(cl) {

    const gsApi = google.sheets({
        version: 'v4',
        auth: cl
    })

    const opt = {
        spreadsheetId: '1eP-VwcpLEpjUGiaAwgxJM0MbkIMIXCcFkeW9cDtO20Q',
        range: 'Data!B2:H200'
    }

    let data = await gsApi.spreadsheets.values.get(opt)
    let dataArray = data.data.values

    return dataArray
}

//change innerHtml and save the file to the specified path
function changeInnerHtml(text1, text2, text3, destination) {
    const fileData = fs.readFileSync(destination, {
            encoding: 'UTF-8',
        }),
        JSDOM = require('jsdom').JSDOM,
        jsdom = new JSDOM(fileData),
        window = jsdom.window,
        $ = require('jquery')(window)

    if (text1 === undefined) text1 = ''

    $('#text5').text(text1)
    $('#text6').text(text2)
    $('#text7').text(text3)

    const htmlWithoutRoot = $('html').html()
    const wholeHtml = '<!DOCTYPE html><html lang="en">' + htmlWithoutRoot + '</html>'

    fs.writeFileSync(destination, wholeHtml)
}
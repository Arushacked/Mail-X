const express = require('express')
const Mail = require('../models/mail')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = new express.Router()

const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );
    
    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if(err) {
                reject("Failed to create access token :(");
            }
            resolve(token);
        });
    });
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter;
};

const sendEmail = async (emailOptions) => {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
};


router.post('/mail', auth, async (req,res) => {
    const mail = new Mail ({
        ...req.body
    })
    
    try {
        await mail.save()
        sendEmail({
            subject: mail["subject"],
            text: mail["content"],
            to: mail["toAddress"],
            cc: mail["ccAddress"],
            from: process.env.EMAIL
        })
        User.findById(req.user._id, function(err, user) {
            if(err) {
                return res.send('User Not Found')
            }
            
            user.mails.push(mail);
            user.save()
            res.status(201).send({mail, user})
        })
    } catch(e) {
        res.status(400).send(e)
    }
})


router.get('/mail/:id', async (req,res) =>{
    const _id = req.params.id

    try {
        const mail = await Mail.findOne({ _id})

        if(!mail) {
            return res.status(404).send()
        }

        res.send(mail)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.patch('/mail/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['toAddress', 'ccAddress','subject','content','enabled','frequency']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid Update'})
    }

    try {
        const mail = await Mail.findOne({ _id: req.params.id})
        if(!mail) {
            return res.status(404).send()
        }

        updates.forEach((update) => mail[update] = req.body[update])
        await mail.save()
        res.send(mail)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/mail/:id', async (req, res) =>{
    try{
        const mail = await Mail.findOne({ _id: req.params.id})

        if(!mail) {
            return res.status(404).send()
        }
        
        mail["enabled"] = false
        await mail.save()
        res.send(mail)
    } catch(e) {
        res.status(400).send(e)
    }
})


module.exports = router
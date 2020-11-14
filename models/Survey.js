const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
    title: String,
    body: String,
    subject: String,
    recipients: [RecipientSchema], //array of RecipientSchema record/ sub document collection   
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    _user: { type: Schema.Types.ObjectId, ref: 'User' }, //this will set up a relationship between a Schema ansd a given user
    dateSent: Date,
    lastResponded: Date
});

mongoose.model('surveys', surveySchema);
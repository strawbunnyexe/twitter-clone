const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name);

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;

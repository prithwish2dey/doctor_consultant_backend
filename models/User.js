const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema
const UserSchema = new Schema({
  parentName: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: false
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// Patient Schema
const patientSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  fathersName: {
    type: String,
    required: true
  },
  mothersName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  appointmentNumber: {
    type: String,
    required: true
  },
  dateofappointment: {
    type: Date,
    required: true
  },
  serialNumber: {
    type: Number,
    required: true
  },
  doctorname:{
    type: String,
    required: true
  },
  clinicLocation: {
    type: String, // New field to store clinic location
    required: true
  }
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = { User, Patient };

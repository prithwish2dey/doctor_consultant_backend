const express = require('express');
const router = express.Router();
const { Patient } = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Function to generate a serial number based on the slot
const generateSerialNumber = async (slot) => {
  try {
    const count = await Patient.countDocuments({ slot: slot });
    return count + 1; // Increment count to generate the next serial number
  } catch (error) {
    throw new Error('Error generating serial number');
  }
};

// Function to generate a random appointment number
const generateAppointmentNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
};

// Endpoint to create a new patient appointment
router.post('/patients', async (req, res) => {
  try {
    const { slot, doctorname, clinicLocation } = req.body; // Extract clinicLocation from request body
    const serialNumber = await generateSerialNumber(slot);
    const appointmentNumber = generateAppointmentNumber();
    const patientData = {
      ...req.body,
      serialNumber: serialNumber,
      appointmentNumber: appointmentNumber,
      doctorname: doctorname, // Ensure doctorname is stored
      clinicLocation: clinicLocation // Ensure clinicLocation is stored
    };

    const patient = await Patient.create(patientData);
    res.json(patient);
  } catch (error) {
    console.error('Error creating patient appointment:', error);
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to get the latest patient appointment
router.get('/patients/latest', async (req, res) => {
  try {
    const latestPatient = await Patient.findOne().sort({ createdAt: -1 });
    res.json(latestPatient);
  } catch (error) {
    console.error('Error fetching latest patient appointment:', error);
    res.status(500).json({ error: 'Error fetching latest patient appointment' });
  }
});


// routes/patients.js

router.get('/patients/age/:age/appointment/:dateofappointment', async (req, res) => {
  const { age, dateofappointment } = req.params;
  
  try {
    const patients = await Patient.find({ 
      age: parseInt(age),
      dateofappointment: new Date(dateofappointment)
    });
    
    if (patients.length === 0) {
      return res.status(404).json({ message: 'No patients found with the specified age and appointment date' });
    }
    
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/payment', async (req, res) => {
  try {
      const product = await stripe.products.create({
          name: "Appointment Booking",
      });

      const price = await stripe.prices.create({
          product: product.id,
          unit_amount: 100 * 90, // 100 INR
          currency: 'inr',
      });

      const session = await stripe.checkout.sessions.create({
          line_items: [
              {
                  price: price.id,
                  quantity: 1,
              }
          ],
          mode: 'payment',
          success_url: 'http://localhost:5173/success',
          cancel_url: 'http://localhost:5173/cancel',
          customer_email: 'demo@gmail.com',
      });

      res.json({ url: session.url });
  } catch (error) {
      console.error('Error creating payment session:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});






module.exports = router;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// DATABASE CONNECTION
// ----------------------------------------------------
// Localhost hata kar strictly 127.0.0.1 daal dein
// Localhost hata kar temporary cloud connection string daal dein
const MONGO_URI = 'mongodb+srv://test_user:PropErp123@cluster0.p7uzr.mongodb.net/property_erp?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✓ MongoDB Connected Successfully to property_erp DB'))
  .catch(err => console.error('Database connection error:', err));

// ----------------------------------------------------
// MONGOOSE SCHEMAS & MODELS
// ----------------------------------------------------
const propertySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  scheme: { type: String, required: true },
  fee: { type: String, default: "0" },
  regAmt: { type: String, default: "0" },
  mode: { type: String, required: true },
  status: { type: String, default: "Active" }
}, { timestamps: true });

const Property = mongoose.model('Property', propertySchema);

const applicantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  propertyId: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: "Pending" }
}, { timestamps: true });

const Applicant = mongoose.model('Applicant', applicantSchema);

// NAYA MODEL: Strictly validated types
const auctionBidSchema = new mongoose.Schema({
  id: { type: String, required: true },
  propertyId: { type: String, required: true },
  bidderName: { type: String, required: true },
  basePrice: { type: Number, required: true },
  currentBid: { type: Number, required: true }
}, { timestamps: true });

const AuctionBid = mongoose.model('AuctionBid', auctionBidSchema);

// ----------------------------------------------------
// HELPERS
// ----------------------------------------------------
const generate6DigitId = async () => {
  let isUnique = false;
  let newId = '';
  while (!isUnique) {
    newId = Math.floor(100000 + Math.random() * 900000).toString();
    const exists = await Property.findOne({ id: newId });
    if (!exists) isUnique = true;
  }
  return newId;
};

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. PROPERTIES
app.get('/api/properties', async (req, res) => {
  try {
    const allProperties = await Property.find().sort({ createdAt: -1 });
    res.json(allProperties);
  } catch (error) {
    res.status(500).json({ error: "DB Fetch Error" });
  }
});

app.post('/api/properties', async (req, res) => {
  try {
    const { type, scheme, fee, regAmt, mode } = req.body;
    const generatedId = await generate6DigitId();
    const newProperty = new Property({ id: generatedId, type, scheme, fee, regAmt, mode });
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ error: "DB Save Error" });
  }
});

// 2. APPLICANTS
app.get('/api/applicants', async (req, res) => {
  try {
    const allApplicants = await Applicant.find().sort({ createdAt: -1 });
    res.json(allApplicants);
  } catch (error) {
    res.status(500).json({ error: "DB Fetch Error" });
  }
});

app.post('/api/applicants', async (req, res) => {
  try {
    const { name, type } = req.body;
    const generatedPropId = await generate6DigitId();
    const newApplicant = new Applicant({
      id: `AP-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      propertyId: generatedPropId,
      type
    });
    await newApplicant.save();
    res.status(201).json(newApplicant);
  } catch (error) {
    res.status(500).json({ error: "DB Save Error" });
  }
});

// 3. AUCTIONS (Fixed with full console tracking)
app.get('/api/auctions', async (req, res) => {
  try {
    const allBids = await AuctionBid.find().sort({ currentBid: -1 });
    res.json(allBids);
  } catch (error) {
    res.status(500).json({ error: "DB Fetch Error in Auctions" });
  }
});

app.post('/api/auctions', async (req, res) => {
  try {
    const { propertyId, bidderName, basePrice, currentBid } = req.body;
    
    // Strict Object creation bina purane type strict blocks ke
    const newBid = new AuctionBid({
      id: `BID-${Math.floor(1000 + Math.random() * 9000)}`,
      propertyId: String(propertyId),
      bidderName: String(bidderName),
      basePrice: Number(basePrice) || 0,
      currentBid: Number(currentBid) || 0
    });

    const savedData = await newBid.save();
    return res.status(201).json(savedData);
  } catch (error) {
    // ⚠️ TERMINAL CHECK: Apne VS Code ke backend terminal mein dekhiye niche kya print ho raha hai:
    console.log("-----------------------------------------");
    console.log("🔴 REAL MONGO CRASH REASON IS:", error.message);
    console.log("-----------------------------------------");
    return res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: "OK", dbStatus: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED" });
});

app.listen(PORT, () => {
  console.log(`✓ ERP Full-Stack Server running on http://localhost:${PORT}`);
});
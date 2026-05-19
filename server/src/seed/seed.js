const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const connectDB = require('../config/db')
const User = require('../models/User')
const Property = require('../models/Property')
const Inquiry = require('../models/Inquiry')
const Review = require('../models/Review')
const Visit = require('../models/Visit')

dotenv.config()

const demoPassword = 'Demo@1234'

const placeholderImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
]

const seedUserEmails = [
  'admin@nestiq.com',
  'priya.agent@nestiq.com',
  'rohan.seller@nestiq.com',
  'neha.agent@nestiq.com',
  'buyer@nestiq.com',
]

const seedPropertyTitles = [
  'Sea View 3 BHK Apartment in Bandra West',
  'Modern 2 BHK Flat in Hinjewadi Phase 1',
  'Builder Floor 4 BHK in South Delhi',
  'Luxury Villa near Whitefield',
  'Premium 3 BHK in Gachibowli',
  'Elegant 3 BHK Apartment in Adyar',
  'Affordable 2 BHK near Salt Lake Sector V',
  'Residential Plot near Gangapur Road',
  'High-End 3 BHK in Golf Course Road',
  'Beachside Villa in North Goa',
]

const seedData = async () => {
  try {
    await connectDB()

    console.log('Clearing old demo data...')
    const existingSeedUsers = await User.find({ email: { $in: seedUserEmails } }).select('_id')
    const existingSeedProperties = await Property.find({ title: { $in: seedPropertyTitles } }).select('_id')

    const seedUserIds = existingSeedUsers.map((user) => user._id)
    const seedPropertyIds = existingSeedProperties.map((property) => property._id)

    await Visit.deleteMany({
      $or: [{ user: { $in: seedUserIds } }, { property: { $in: seedPropertyIds } }],
    })
    await Review.deleteMany({
      $or: [{ agent: { $in: seedUserIds } }, { reviewer: { $in: seedUserIds } }],
    })
    await Inquiry.deleteMany({
      $or: [{ sender: { $in: seedUserIds } }, { property: { $in: seedPropertyIds } }],
    })
    await Property.deleteMany({ title: { $in: seedPropertyTitles } })
    await User.deleteMany({ email: { $in: seedUserEmails } })

    const hashedPassword = await bcrypt.hash(demoPassword, 10)

    console.log('Creating demo users...')
    const users = await User.insertMany([
      {
        name: 'Aarav Mehta',
        email: 'admin@nestiq.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+91 90000 10001',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isVerified: true,
      },
      {
        name: 'Priya Sharma',
        email: 'priya.agent@nestiq.com',
        password: hashedPassword,
        role: 'agent',
        phone: '+91 90000 10002',
        avatar: 'https://i.pravatar.cc/150?img=32',
        isVerified: true,
      },
      {
        name: 'Rohan Kapoor',
        email: 'rohan.seller@nestiq.com',
        password: hashedPassword,
        role: 'seller',
        phone: '+91 90000 10003',
        avatar: 'https://i.pravatar.cc/150?img=15',
        isVerified: true,
      },
      {
        name: 'Neha Iyer',
        email: 'neha.agent@nestiq.com',
        password: hashedPassword,
        role: 'agent',
        phone: '+91 90000 10004',
        avatar: 'https://i.pravatar.cc/150?img=47',
        isVerified: true,
      },
      {
        name: 'Kabir Singh',
        email: 'buyer@nestiq.com',
        password: hashedPassword,
        role: 'buyer',
        phone: '+91 90000 10005',
        avatar: 'https://i.pravatar.cc/150?img=20',
        isVerified: true,
      },
    ])

    const priya = users[1]
    const rohan = users[2]
    const neha = users[3]
    const buyer = users[4]

    console.log('Creating demo properties...')
    const properties = await Property.insertMany([
      {
        title: 'Sea View 3 BHK Apartment in Bandra West',
        description:
          'Premium apartment with open sea views, modern interiors, covered parking, and quick access to Linking Road, Carter Road, and top schools.',
        type: 'Apartment',
        price: 48500000,
        location: {
          address: 'Near Carter Road, Bandra West',
          city: 'Mumbai',
          lat: 19.0596,
          lng: 72.8295,
        },
        images: [placeholderImages[0], placeholderImages[1]],
        amenities: ['Sea View', 'Gym', 'Lift', 'Covered Parking', 'Security'],
        bhk: 3,
        bathrooms: 3,
        area: 1450,
        floor: 12,
        furnishing: 'Semi Furnished',
        facing: 'West',
        status: 'active',
        badge: 'Hot Deal',
        agent: priya._id,
        views: 342,
      },
      {
        title: 'Modern 2 BHK Flat in Hinjewadi Phase 1',
        description:
          'Well-planned home in a gated society close to IT parks, schools, daily stores, and the upcoming metro corridor.',
        type: 'Apartment',
        price: 8200000,
        location: {
          address: 'Hinjewadi Phase 1, near Rajiv Gandhi Infotech Park',
          city: 'Pune',
          lat: 18.5913,
          lng: 73.7389,
        },
        images: [placeholderImages[1], placeholderImages[2]],
        amenities: ['Club House', 'Swimming Pool', 'Gym', 'Power Backup', 'Lift'],
        bhk: 2,
        bathrooms: 2,
        area: 910,
        floor: 8,
        furnishing: 'Unfurnished',
        facing: 'East',
        status: 'active',
        badge: 'New',
        agent: rohan._id,
        views: 186,
      },
      {
        title: 'Builder Floor 4 BHK in South Delhi',
        description:
          'Spacious builder floor with premium fittings, servant room, reserved parking, and excellent connectivity to markets and metro stations.',
        type: 'House',
        price: 62500000,
        location: {
          address: 'Greater Kailash II',
          city: 'Delhi',
          lat: 28.5342,
          lng: 77.2433,
        },
        images: [placeholderImages[2], placeholderImages[3]],
        amenities: ['Modular Kitchen', 'Private Parking', 'Security', 'Balcony'],
        bhk: 4,
        bathrooms: 4,
        area: 2700,
        floor: 2,
        furnishing: 'Fully Furnished',
        facing: 'North East',
        status: 'active',
        badge: 'Price Reduced',
        agent: neha._id,
        views: 411,
      },
      {
        title: 'Luxury Villa near Whitefield',
        description:
          'Independent villa in a quiet gated community with landscaped garden, home office, private terrace, and easy access to Whitefield tech parks.',
        type: 'Villa',
        price: 34500000,
        location: {
          address: 'Varthur Road, Whitefield',
          city: 'Bangalore',
          lat: 12.9698,
          lng: 77.7499,
        },
        images: [placeholderImages[3], placeholderImages[4]],
        amenities: ['Private Garden', 'Club House', 'Gym', 'Security', 'Power Backup'],
        bhk: 4,
        bathrooms: 4,
        area: 3200,
        floor: 0,
        furnishing: 'Semi Furnished',
        facing: 'East',
        status: 'active',
        badge: 'Hot Deal',
        agent: priya._id,
        views: 275,
      },
      {
        title: 'Premium 3 BHK in Gachibowli',
        description:
          'High-rise apartment with city views, large balconies, and quick access to Financial District, HITEC City, and major office campuses.',
        type: 'Apartment',
        price: 15800000,
        location: {
          address: 'Gachibowli Main Road',
          city: 'Hyderabad',
          lat: 17.4401,
          lng: 78.3489,
        },
        images: [placeholderImages[4], placeholderImages[0]],
        amenities: ['Swimming Pool', 'Gym', 'Jogging Track', 'Lift', 'Security'],
        bhk: 3,
        bathrooms: 3,
        area: 1680,
        floor: 14,
        furnishing: 'Semi Furnished',
        facing: 'North',
        status: 'active',
        badge: 'New',
        agent: rohan._id,
        views: 224,
      },
      {
        title: 'Elegant 3 BHK Apartment in Adyar',
        description:
          'Comfortable family apartment in a mature neighbourhood with excellent schools, hospitals, cafes, and beach access within a short drive.',
        type: 'Apartment',
        price: 21500000,
        location: {
          address: 'LB Road, Adyar',
          city: 'Chennai',
          lat: 13.0067,
          lng: 80.2578,
        },
        images: [placeholderImages[0], placeholderImages[2]],
        amenities: ['Lift', 'Covered Parking', 'Power Backup', 'Security'],
        bhk: 3,
        bathrooms: 3,
        area: 1550,
        floor: 6,
        furnishing: 'Fully Furnished',
        facing: 'South',
        status: 'active',
        badge: 'Price Reduced',
        agent: neha._id,
        views: 198,
      },
      {
        title: 'Affordable 2 BHK near Salt Lake Sector V',
        description:
          'Budget-friendly apartment suitable for working professionals, with reliable transport links and close access to offices and shopping areas.',
        type: 'Apartment',
        price: 6800000,
        location: {
          address: 'Salt Lake Sector V',
          city: 'Kolkata',
          lat: 22.5797,
          lng: 88.4337,
        },
        images: [placeholderImages[1], placeholderImages[3]],
        amenities: ['Lift', 'Security', 'Community Hall', 'Power Backup'],
        bhk: 2,
        bathrooms: 2,
        area: 980,
        floor: 5,
        furnishing: 'Unfurnished',
        facing: 'East',
        status: 'active',
        badge: 'Hot Deal',
        agent: priya._id,
        views: 163,
      },
      {
        title: 'Residential Plot near Gangapur Road',
        description:
          'Clear-title residential plot in a fast-developing Nashik locality, suitable for a bungalow or long-term investment.',
        type: 'Plot',
        price: 4600000,
        location: {
          address: 'Gangapur Road extension',
          city: 'Nashik',
          lat: 20.011,
          lng: 73.7281,
        },
        images: [placeholderImages[2]],
        amenities: ['Gated Layout', 'Road Access', 'Water Connection', 'Street Lights'],
        bhk: 0,
        bathrooms: 0,
        area: 1800,
        floor: 0,
        furnishing: 'Not Applicable',
        facing: 'North',
        status: 'active',
        badge: 'New',
        agent: rohan._id,
        views: 97,
      },
      {
        title: 'High-End 3 BHK in Golf Course Road',
        description:
          'Premium apartment with excellent club amenities, fast office access, and a polished layout for families working around Cyber City.',
        type: 'Apartment',
        price: 39800000,
        location: {
          address: 'Golf Course Road, Sector 54',
          city: 'Gurgaon',
          lat: 28.4355,
          lng: 77.1116,
        },
        images: [placeholderImages[3], placeholderImages[0]],
        amenities: ['Club House', 'Swimming Pool', 'Gym', 'Concierge', 'Security'],
        bhk: 3,
        bathrooms: 4,
        area: 2250,
        floor: 18,
        furnishing: 'Semi Furnished',
        facing: 'North East',
        status: 'active',
        badge: 'Price Reduced',
        agent: neha._id,
        views: 356,
      },
      {
        title: 'Beachside Villa in North Goa',
        description:
          'Tastefully designed villa close to cafes, beaches, and nightlife, with private pool, deck area, and strong short-stay rental potential.',
        type: 'Villa',
        price: 52500000,
        location: {
          address: 'Assagao, North Goa',
          city: 'Goa',
          lat: 15.5989,
          lng: 73.7684,
        },
        images: [placeholderImages[4], placeholderImages[1]],
        amenities: ['Private Pool', 'Garden', 'Deck', 'Security', 'Power Backup'],
        bhk: 4,
        bathrooms: 5,
        area: 3600,
        floor: 0,
        furnishing: 'Fully Furnished',
        facing: 'West',
        status: 'active',
        badge: 'Hot Deal',
        agent: priya._id,
        views: 489,
      },
    ])

    buyer.savedProperties = [properties[0]._id, properties[3]._id, properties[9]._id]
    await buyer.save()

    console.log('Creating sample inquiries, visits, and reviews...')
    await Inquiry.insertMany([
      {
        property: properties[0]._id,
        sender: buyer._id,
        message: 'I am interested in this Bandra apartment. Please share the maintenance cost and available visit slots.',
        status: 'contacted',
      },
      {
        property: properties[3]._id,
        sender: buyer._id,
        message: 'Can you confirm if the Whitefield villa has a separate servant room and two covered parking spaces?',
        status: 'new',
      },
      {
        property: properties[9]._id,
        sender: buyer._id,
        message: 'Please send more details about rental income potential for this Goa villa.',
        status: 'new',
      },
    ])

    await Visit.insertMany([
      {
        property: properties[0]._id,
        user: buyer._id,
        date: new Date('2026-06-05'),
        time: '11:30',
        status: 'scheduled',
      },
      {
        property: properties[3]._id,
        user: buyer._id,
        date: new Date('2026-06-08'),
        time: '16:00',
        status: 'scheduled',
      },
    ])

    await Review.insertMany([
      {
        agent: priya._id,
        reviewer: buyer._id,
        rating: 5,
        comment: 'Very responsive and shared clear property details before the visit.',
      },
      {
        agent: rohan._id,
        reviewer: buyer._id,
        rating: 4,
        comment: 'Helpful with pricing context and locality information.',
      },
    ])

    console.log('Seed completed successfully.')
    console.log(`Users created: ${users.length}`)
    console.log(`Properties created: ${properties.length}`)
    console.log('Demo password for every user: Demo@1234')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error(`Seed failed: ${error.message}`)
    await mongoose.connection.close()
    process.exit(1)
  }
}

seedData()

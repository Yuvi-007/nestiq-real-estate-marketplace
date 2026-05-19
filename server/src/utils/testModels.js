const User = require('../models/User')
const Property = require('../models/Property')
const Inquiry = require('../models/Inquiry')
const Review = require('../models/Review')
const Visit = require('../models/Visit')

const models = {
  User,
  Property,
  Inquiry,
  Review,
  Visit,
}

Object.entries(models).forEach(([name, model]) => {
  if (!model.modelName || typeof model.schema !== 'object') {
    throw new Error(`${name} model did not load correctly`)
  }
})

console.log('All NestIQ Mongoose models loaded successfully')
console.log(`Loaded models: ${Object.keys(models).join(', ')}`)

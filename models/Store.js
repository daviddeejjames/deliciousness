const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Define our indexes
storeSchema.index({
  name: 'text',
  description: 'text'
});

storeSchema.index({
  location: '2dsphere'
});

storeSchema.pre('save', async function(next){
  if(!this.isModified('name')){
    next(); // Skip it
    return; // Stop function here
  }
  this.slug = slug(this.name);
  // Find stores that may already have the same slug
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');

  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (storesWithSlug.length){
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }

  next(); // Needed for save to occur
});

// Custom query to get all the store tags (and the num if them)
storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

// Custom query to get Top Rated Stores
storeSchema.statics.getTopStores = function () {
  return this.aggregate([
    // Look stores and populate their reviews
    { $lookup:
      { from: 'reviews', localField: '_id',
        foreignField: 'store', as: 'reviews' }
    },
    // Filter for only items that have 2 or more reviews
    { $match: { 'reviews.1': { $exists: true } } },
    // Add the average reveiws field
    { $addFields: {
      averageRating: { $avg: '$reviews.rating' }
    }},
    // Sor it by out new field, highest reviews first
    { $sort: { averageRating: -1 } },
    // Only show 10
    { $limit: 10 }
  ]);
};

storeSchema.virtual('reviews', {
  ref: 'Review', // which model to link
  localField: '_id', // which field on store
  foreignField: 'store' // which field on review
});

function autopopulate(next) {
  this.populate('reviews');
  next();
}

storeSchema.pre('find', autopopulate);
storeSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Store', storeSchema);
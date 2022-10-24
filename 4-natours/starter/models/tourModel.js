const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'No se ha definido un nombre para el tour.'],
    trim: true,
    unique: true,
    maxlength: [50, 'Se supero el maximo de caracteres'],
    minlength: [10, 'No cumple el minimo de caracteres']
  },
  slug: String,
  price: {
    type: Number,
    require: [true, 'El tour debe tener un precio.']
  },
  priceDiscount: {
    type: Number,
    default: 0,
    validate: {
      validator: function (val) {
        return val < this.price
      },
      message: 'El descuento {VALUE} no puede ser mayor que el precio original .'
    }
  },
  duration: {
    type: Number,
    require: [true, 'El tour debe tener una duracion.']
  },
  maxGroupSize: {
    type: Number,
    require: [true, 'El tour debe tener un maximo por grupo.']
  },
  difficulty: {
    type: String,
    trim: true,
    require: [true, 'El tour debe tener una dificultad.'],
    enum: {
      message: 'Valor no permitido',
      values: ['easy', 'hard', 'medium']
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  summary: {
    type: String,
    trim: true,
    default: '',
    max: 100
  },
  description: {
    type: String,
    trim: true,
    default: '',
    max: 500
  },
  imageCover: {
    type: String,
    trim: true,
    require: [true, 'El tour debe tener una imagen principal.']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  vip: {
    type: Boolean,
    default: false
  },
  startDates: [Date]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

// Document Middleweres

// Before the query has execute when .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Before the query has execute
// tourSchema.pre('find', function (next) {
tourSchema.pre(/^find/, function (next) {
  this.find({ vip: { $ne: true } })
  next()
})

// After the query has finished
// tourSchema.post(/^find/, function (doc, next) {
//   next()
// })

// Aggregation Middleweres

tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { vip: { $ne: true } } })
  console.log(this)
  next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour

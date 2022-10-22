const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'No se ha definido un nombre para el tour.'],
    trim: true,
    unique: true
  },

  price: {
    type: Number,
    require: [true, 'El tour debe tener un precio.']
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
    require: [true, 'El tour debe tener una dificultad.']
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
  startDates: [Date]
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour

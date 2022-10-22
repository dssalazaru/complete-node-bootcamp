const Tour = require(`${__dirname}/../models/tourModel`)

// Middleweres

exports.topPrice = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

// Methods

exports.list = async (req, res) => {
  try {
    // Build the query
    const queryObj = { ...req.query }
    const excludedFields = ['pages', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

    let query = Tour.find(JSON.parse(queryStr))

    // Sorting
    if (query && req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // Fields
    if (query && req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    if (query && req.query.page) {
      const numTours = await Tour.countDocuments()
      if (skip > numTours) throw new Error('La pagina solicitada no existe.')
    }

    // Execute the query
    const tours = await query

    // Send the response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      page,
      limit,
      data: {
        tours
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err || 'Object not found'
    })
  }
}

exports.retrieve = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    if (!tour) {
      return res.status(404).json({
        status: 'failed',
        message: 'Object not found'
      })
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err || 'Object not found'
    })
  }
}

exports.create = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      message: 'Object has been created successfully',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
}

exports.update = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    if (!tour) {
      return res.status(404).json({
        status: 'failed',
        message: 'Object not found'
      })
    }

    res.status(201).json({
      status: 'success',
      message: 'Object has been updated successfully',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
}

exports.delete = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id)

    if (!tour) {
      return res.status(404).json({
        status: 'failed',
        message: 'Object not found'
      })
    }

    res.status(204).json({
      status: 'success',
      message: 'Object has been deleted successfully',
      data: null
    })
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    })
  }
}

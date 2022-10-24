const Tour = require(`${__dirname}/../models/tourModel`)
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`)
const AppError = require(`${__dirname}/../utils/appError`)
const catchAsync = require(`${__dirname}/../utils/catchAsync`)

// Middleweres

exports.topPrice = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

// Methods

exports.list = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination()
  const tours = await features.query

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })

  // try {
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err
  //   })
  // }
})

exports.retrieve = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)
    .select('-__v')

  if (!tour) { return next(new AppError('Object not found', 404)) }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
  // try {
  // } catch (err) {
  //   res.status(404).json({
  //     status: 'failed',
  //     message: err || 'Object not found'
  //   })
  // }
})

exports.create = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: 'success',
    message: 'Object has been created successfully',
    data: {
      tour: newTour
    }
  })
  //   try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err
  //   })
  // }
})

exports.update = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!tour) { return next(new AppError('Object not found', 404)) }

  res.status(201).json({
    status: 'success',
    message: 'Object has been updated successfully',
    data: {
      tour
    }
  })
  //   try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err
  //   })
  // }
})

exports.delete = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)

  if (!tour) { return next(new AppError('Object not found', 404)) }

  res.status(204).json({
    status: 'success',
    message: 'Object has been deleted successfully',
    data: null
  })
  //   try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err
  //   })
  // }
})

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 }
      }
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        count: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: -1 }
      // },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
    }
  ])
  res.status(200).json({
    status: 'success',
    message: 'Stats successfully',
    data: stats
  })
  //   try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err
  //   })
  // }
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(year, 0, 1),
          $lte: new Date(year, 11, 31)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        count: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        count: -1
      }
    }
  ])
  res.status(200).json({
    status: 'success',
    message: 'Stats successfully',
    data: plan
  })
  //   try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'failed',
  //     message: err
  //   })
  // }
})

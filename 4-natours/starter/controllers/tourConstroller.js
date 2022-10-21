const fs = require('fs');

// Database

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))

//

let currentObject

//

exports.checkID = (req, res, next) => {
    const id = req.params.id * 1
    const object = tours.find(item => item.id === id)

    if (!object) {
        return res.status(404).json({
            status: 'failed',
            message: 'Invalid ID'
        })
    }

    currentObject = object

    next();
}

// Methods

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours
        }
    })
}

exports.getTour = (req, res) => {

    res.status(200).json({
        status: 'success',
        data: {
            tour: currentObject
        }
    })
}

exports.createTour = (req, res) => {

    const ids = tours.map(item => item.id)
    const maxId = Math.max(...ids)

    if (req.body.name) {

        delete req.body.id

        const tour = Object.assign({ id: maxId + 1 }, req.body)
        tours.push(tour)

        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
            if (err) {
                res.status(500).json({
                    status: 'failed',
                    data: {
                        message: err,
                    }
                })
            }
        })
        res.status(201).json({
            status: 'success',
            data: {
                tour
            }
        })

    } else {
        res.status(400).json({
            status: 'failed',
            data: {
                message: 'Invalid name',
            }
        })
    }
}

exports.updateTour = (req, res) => {


    res.status(200).json({
        status: 'success',
        data: {
            tour: currentObject
        }
    })
}

exports.deleteTour = (req, res) => {

    res.status(204).json({
        status: 'success',
        data: null
    })
}
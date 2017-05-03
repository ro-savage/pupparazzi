const express = require('express')
const fs = require('fs')
const router = express.Router()

module.exports = router

router.get('/', (req, res) => {
  res.redirect('/puppies')
})

function getFileContents (file, callback) {
  fs.readFile(file, 'utf-8', (err, contents) => {
    if (err) {
      callback(err)
    }
    const data = JSON.parse(contents)
    callback(null, data)
  })
}

router.get('/puppies', (req, res) => {
  getFileContents('./data.json', (err, contents) => {
    if (err) {
      return err
    }
    res.render('./puppies/index', contents)
  })
})

router.get('/puppies/:id', (req, res) => {
  const id = req.params.id
  getFileContents('./data.json', (err, contents) => {
    if (err) {
      return err
    }
    const puppy = contents.puppies.find((puppy) => {
      return puppy.id === Number(id)
    })
    res.render('./puppies/view', puppy)
  })
})

router.get('/puppies/edit/:id', (req, res) => {
  const id = req.params.id
  getFileContents('./data.json', (err, contents) => {
    if (err) {
      return err
    }
    const puppy = contents.puppies.find((puppy) => {
      return puppy.id === Number(id)
    })
    res.render('./puppies/edit', puppy)
  })
})

router.post('/puppies/edit/:id', (req, res) => {
  const id = req.params.id
  getFileContents('./data.json', (err, contents) => {
    if (err) {
      return err
    }
    const puppy = contents.puppies.find((puppy => {
      return puppy.id === Number(id)
    }))
    const editPuppy = {
      "id": puppy.id,
      "name": req.body.name,
      "owner": req.body.owner,
      "image":`/images/puppy${id}.jpg`,
      "breed": req.body.breed
    }
    contents.puppies.splice(puppy.id - 1, 1, editPuppy)
    const newPuppies = JSON.stringify(contents)
    fs.writeFile('./data.json', newPuppies, (err) => {
      if (err) {
        return err
      }
      res.redirect(`/puppies/${id}`)
    })
  })
})

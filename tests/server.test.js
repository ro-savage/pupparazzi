const test = require('tape')
const request = require('supertest')
const cheerio = require('cheerio')

const server = require('../server')

test('Test harness is working', (t) => {
  t.pass()
  t.end()
})


test('/ redirects to /puppies', t => {
  const expected = 302
  request(server)
    .get('/')
    .expect(302)
    .end((err, res) => {
      t.error(err)
      t.equals(res.statusCode, expected)
      t.end()
    })
})

test('/puppies/2 route adds "Jae" as the puppy name', (t) => {
  const expected = 'Jae'
  request(server)
    .get('/puppies/2')
    .end((err, res) => {
      t.error(err)
      const $ = cheerio.load(res.text)
      const actual = $('h2').text()
      t.equals(actual, expected)
      t.end()
    })
})

test('index.hbs renders 6 puppy images', (t) => {
  const expected = 6
  request(server)
    .get('/puppies')
    .end((err, res) => {
      t.error(err)
      const $ = cheerio.load(res.text)
      const actual = $('.img-circle').length
      t.equals(actual, expected)
      t.end()
    })
})

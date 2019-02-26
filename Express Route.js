const router = require('express').Router()
const {Product} = require('../db/models')
module.exports = router

//returns all products
router.get('/', async (req, res, next) => {
  try {
    const allProducts = await Product.findAll()
    res.json(allProducts)
  } catch (err) {
    next(err)
  }
})

//returns single product by id
router.get('/:id', async (req, res, next) => {
  const productId = req.params.id
  try {
    const singleProduct = await Product.findById(productId)
    res.json(singleProduct)
  } catch (err) {
    next(err)
  }
})

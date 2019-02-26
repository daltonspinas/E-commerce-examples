'use strict'

// Assertions
const chai = require('chai')
const expect = chai.expect

// Product Model
const db = require('../server/db')
const Product = db.model('product')

// Product Routes
const app = require('../server')
const agent = require('supertest')(app)

// AllProducts component
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
enzyme.configure({adapter: new Adapter()})
import React from 'react'
import {AllProducts} from '../client/components/AllProducts'

// Redux
import reducer, {
  GET_ALL_PRODUCTS,
  getAllProducts
} from '../client/store/product'

describe('Product Slice', () => {
  // defined in ../server/db/models/product.js
  describe('Product model', () => {
    describe('Validations', () => {
      it('requires `name`', async () => {
        const product = Product.build()

        try {
          await product.validate()
          throw Error(
            'validation was successful but should have failed without `name`'
          )
        } catch (err) {
          expect(err.message).to.contain('name cannot be null')
        }
      })

      it('requires `name` to not be an empty string', async () => {
        const product = Product.build({
          name: ''
        })

        try {
          await product.validate()
          throw Error(
            'validation was successful but should have failed if name is an empty string'
          )
        } catch (err) {
          expect(err.message).to.contain('Validation error')
          /* handle error */
        }
      })
    })
  })

  // defined in ../server/api/products.js
  describe('Product routes', () => {
    let storedProducts

    const productData = [
      {
        name: 'Beef Thing',
        price: 100,
        description: 'here is a beef product'
      },
      {
        name: 'Chicken Thing',
        price: 200,
        description: 'here is a chicken product'
      }
    ]

    beforeEach(async () => {
      const createdProducts = await Product.bulkCreate(productData)
      storedProducts = createdProducts.map(product => product.dataValues)
    })

    // Route for fetching all products
    describe('GET `/api/products`', () => {
      it('serves up all Products', async () => {
        const response = await agent.get('/api/products').expect(200)
        expect(response.body).to.have.length(2)
        expect(response.body[0].name).to.equal(storedProducts[0].name)
      })
    })
  })

  describe('Front-End', () => {
    const products = [
      {
        name: 'Beef Thing',
        price: 100,
        description: 'here is a beef product'
      },
      {
        name: 'Chicken Thing',
        price: 200,
        description: 'here is a chicken product'
      },
      {
        name: 'Pork Thing',
        price: 300,
        description: 'here is a pork product'
      }
    ]
    // defined in ../client/components/AllProducts.js
    describe('<AllProducts /> component', () => {
      it('renders an img element for each product passed in as props', () => {
        const wrapper = shallow(<AllProducts info={{allProducts: products}} />)
        expect(wrapper.find('img')).to.have.length(3)
      })

      it('renders h5 elements with the product name passed in as props', () => {
        const wrapper = shallow(<AllProducts info={{allProducts: products}} />)
        const listItems = wrapper.find('h5')
        expect(listItems).to.have.length(3)
        expect(listItems.at(2).text()).to.contain('Pork')
      })
    })

    // defined in ../client/store/product.js
    describe('`getAllProducts` action creator', () => {
      const getAllProductsAction = getAllProducts(products)

      it('returns a Plain Old JavaScript Object', () => {
        expect(typeof getAllProductsAction).to.equal('object')
        expect(Object.getPrototypeOf(getAllProductsAction)).to.equal(
          Object.prototype
        )
      })

      it('creates an object with `type` and `products`', () => {
        expect(getAllProductsAction.type).to.equal(GET_ALL_PRODUCTS)
        expect(getAllProductsAction.products[1].name).to.equal('Chicken Thing')
      })
    })

    // defined in ../client/store/product.js
    describe('reducer', () => {
      const initialState = {
        allProducts: [],
        allCategories: []
      }

      const newState = reducer(initialState, {
        type: GET_ALL_PRODUCTS,
        products: products
      })

      it('returns a new state with the updated `products`', () => {
        // this should have changed:
        expect(newState.allProducts).to.deep.equal(products)
        // this should not have changed:
        expect(newState.allCategories).to.equal(initialState.allCategories)
      })

      it('does not modify the previous state', () => {
        expect(initialState).to.deep.equal({
          allProducts: [],
          allCategories: []
        })
      })
    })
  })
})

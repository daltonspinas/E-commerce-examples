import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {addItemToCart} from '../store/cart'

export class AllProducts extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(evt) {
    evt.preventDefault()
    const productId = evt.target.id
    this.props.addItemToCart({productId: parseInt(productId, 10), quantity: 1})
  }
  render() {
    if (this.props.info.length === 0) {
      return <div>Please standy, loading products...</div>
    }
    return (
      <div className="container-fluid col-sm-4 col-md-9">
        <h2 id="cat-name" className="mt-5">
          All Products
        </h2>
        <div className="mb-5 row d-flex justify-content-start">
          {this.props.info.allProducts.map(product => {
            return (
              <div
                className="h-70 col-sm-4 col-md-4 d-flex my-3"
                key={product.id}
              >
                <div className="card" width="18rem">
                  <Link to={`/products/${product.id}`}>
                    <img
                      width="150vw"
                      height="220vw"
                      src={product.imageUrl}
                      className="card-img-top"
                      alt="..."
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">${product.price / 100}</p>
                    <a
                      id={product.id}
                      onClick={this.handleClick}
                      href="#"
                      className="btn btn-dark"
                    >
                      Add to Cart
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  info: state.product
})

const mapDispatch = dispatch => ({
  addItemToCart: productObj => dispatch(addItemToCart(productObj))
})

export default connect(mapState, mapDispatch)(AllProducts)

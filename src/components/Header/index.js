import './index.css'
import {IoIosCart} from 'react-icons/io'

const Header = props => {
  const {cartCount, restaurantName} = props

  return (
    <>
      <nav className="nav-container">
        <ul className="list-container">
          <li>
            <h1>{restaurantName}</h1>
          </li>
          <li className="list-item">
            <p className="order">My Orders</p>
            <div>
              <button type="submit">
                <IoIosCart className="cart-icon" />
              </button>
              <p className="count-item">{cartCount}</p>
            </div>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Header

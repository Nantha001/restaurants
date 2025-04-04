import './App.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './components/Header'

const apiStatusOption = {
  success: 'success',
  loading: 'loading',
  apiStatus: 'failure',
}

const loadingView = () => (
  <div className="loading-container">
    <Loader type="TailSpin" height={50} width={50} color="darkred" />
  </div>
)

class App extends Component {
  state = {
    activeId: '',
    foodListData: [],
    apiStatus: apiStatusOption.loading,
    cartCount: 0,
    restaurantName: '',
  }

  componentDidMount() {
    this.apiCall()
  }

  // update

  setActiveId = id => {
    this.setState({activeId: id})
  }

  onClickDecrese = id => {
    this.setState(pre => {
      let update = pre.cartCount
      return {
        foodListData: pre.foodListData.map(each => ({
          ...each,
          categoryDishes: each.categoryDishes.map(dish => {
            if (dish.dishId === id && dish.quantity > 0) {
              update -= 1
              return {...dish, quantity: dish.quantity - 1}
            }
            return dish
          }),
        })),
        cartCount: pre.cartCount > 0 ? update : pre.cartCount,
      }
    })
  }

  onClickIncrease = id => {
    this.setState(pre => ({
      foodListData: pre.foodListData.map(category => ({
        ...category,
        categoryDishes: category.categoryDishes.map(each =>
          each.dishId === id
            ? {
                ...each,
                quantity: each.quantity + 1,
              }
            : each,
        ),
      })),
      cartCount: pre.cartCount + 1,
    }))
  }

  // api

  apiCall = async () => {
    this.setState({apiStatus: apiStatusOption.loading})
    const url =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const options = {method: 'GET'}
    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const resName = data[0].restaurant_name
      const formateData = data[0].table_menu_list.map(each => ({
        categoryDishes: each.category_dishes.map(item => ({
          addonCat: item.addonCat,
          dishAvailability: item.dish_Availability,
          dishType: item.dish_Type,
          dishCalories: item.dish_calories,
          dishCurrency: item.dish_currency,
          dishDescription: item.dish_description,
          dishId: item.dish_id,
          dishImage: item.dish_image,
          dishName: item.dish_name,
          dishPrice: item.dish_price,
          nexturl: item.nexturl,
          quantity: 0,
        })),
        menuCategory: each.menu_category,
        menuCategoryId: each.menu_category_id,
        menuCategoryImage: each.menu_category_image,
        nexturl: each.nexturl,
      }))
      this.setState({
        apiStatus: apiStatusOption.success,
        foodListData: formateData,
        activeId: formateData[0].menuCategory,
        restaurantName: resName,
      })
    } else {
      this.setState({apiStatus: apiStatusOption.failure})
    }
  }

  successView = () => {
    const {activeId, cartCount, foodListData, restaurantName} = this.state
    const activeFoodData = foodListData.filter(
      each => each.menuCategory === activeId,
    )

    console.log(activeFoodData)

    return (
      <>
        <Header restaurantName={restaurantName} cartCount={cartCount} />
        <ul className="categoryList-container">
          {foodListData.map(each => (
            <li key={each.menuCategory}>
              <div className="cate-list-item">
                <button
                  className={each.menuCategory === activeId ? 'active' : 'btn'}
                  onClick={() => this.setActiveId(each.menuCategory)}
                  type="button"
                >
                  {each.menuCategory}
                </button>
              </div>
            </li>
          ))}
        </ul>
        <ul className="menu-container">
          {activeFoodData[0].categoryDishes.map(each => (
            <li className="menu-list" key={each.dishId}>
              <div className="dish-container">
                <h1 className="dish-name">{each.dishName}</h1>
                <p className="list-value">{`${each.dishCurrency} ${each.dishPrice}`}</p>
                <p className="description">{each.dishDescription}</p>
                {each.dishAvailability && (
                  <div className="cart-btn-container">
                    <button
                      onClick={() => this.onClickDecrese(each.dishId)}
                      type="button"
                    >
                      -
                    </button>
                    <p style={{color: 'darkred'}}>{each.quantity}</p>
                    <button
                      onClick={() => this.onClickIncrease(each.dishId)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                )}
                {each.addonCat && each.addonCat.length > 0 && (
                  <p className="customization-msg">Customizations available</p>
                )}
                {!each.dishAvailability && (
                  <p className="not-available">Not available</p>
                )}
              </div>
              <div className="calories-container">
                <p className="calories-title">{`${each.dishCalories} calories`}</p>
                <img
                  className="dish-img"
                  src={each.dishImage}
                  alt={each.dishName}
                />
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <div className="bg-container">
          {apiStatus === apiStatusOption.loading && loadingView()}
          {apiStatus === apiStatusOption.success && this.successView()}
        </div>
      </>
    )
  }
}

export default App

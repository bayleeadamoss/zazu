module.exports = (pluginContext) => {
  const foods = [
    'tiny taco',
    'tiny burrito',
    'tiny cookie cake',
    'tiny cookies',
  ]

  return (query, env = {}) => {
    return new Promise((resolve, reject) => {
      resolve(foods.filter((food) => {
        return food.match(new RegExp(query, 'i'))
      }).map((food) => {
        return {
          icon: 'fa-apple',
          title: food,
          subtitle: 'Select item to copy the value to the clipboard.',
          value: food,
        }
      }))
    })
  }
}

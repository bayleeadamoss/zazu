import React from 'react'

import Result from './result'

export default ({values, onClick}) => {
  return (
    <ul>
      { values.map(function(value, i) {
          return <Result value={value} key={i} />
      }) }
    </ul>
  )
}

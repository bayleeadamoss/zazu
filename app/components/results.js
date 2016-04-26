import React, { PropTypes}  from 'react'

import Result from './result'

const Results = ({values, onClick}) => {
  return (
    <ul>
      { values.map((value, i) => {
        return <Result value={value} key={i} />
      }) }
    </ul>
  )
}

Results.propTypes = {
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Results

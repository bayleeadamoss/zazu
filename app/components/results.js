import { PropTypes } from 'react'

import Result from './result'

const Results = ({values, onClick}) => {
  debugger
  return (
    <ul>
      { values.map((value, i) => {
        return <Result value={value} key={i} />
      }) }
    </ul>
  )
}

Results.propTypes = {
  values: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default Results

const Radio = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    handleUpdate: React.PropTypes.func.isRequired,
  },

  updateValue (event) {
    this.props.handleUpdate(event.target.value)
  },

  render () {
    const { name, value, label } = this.props
    return React.createElement(
      'div',
      { className: 'form-element' },
      React.createElement('input', {
        type: 'radio',
        name: name,
        value: value,
        id: name + '-' + value,
        onChange: this.updateValue,
      }),
      React.createElement(
        'label',
        { htmlFor: name + '-' + value },
        label
      )
    )
  }
})

const Comment = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    handleUpdate: React.PropTypes.func.isRequired,
  },

  updateValue (event) {
    this.props.handleUpdate(event.target.value)
  },

  render () {
    const { name, placeholder, label } = this.props
    return React.createElement(
      'div',
      { className: name },
      React.createElement(
        'label',
        { htmlFor: name },
        label
      ),
      React.createElement('textarea', {
        id: name,
        onChange: this.updateValue,
        placeholder
      })
    )
  }
})

const Form = React.createClass({
  propTypes: {
    onSubmitComplete: React.PropTypes.func.isRequired,
  },
  getInitialState () {
    return {
      isUseful: null,
      comment: null,
    }
  },
  handleSubmit () {
    if (this.state.isUseful) {
      window.newrelic.addPageAction('feedback', {
        isUseful: this.state.isUseful,
        comment: this.state.comment,
      })
      this.props.onSubmitComplete()
    }
  },
  handleCommentUpdate (value) {
    this.setState({
      comment: value,
    })
  },
  handleUsefulFeedback (value) {
    this.setState({
      isUseful: value,
    })
  },
  render () {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'main' },
        React.createElement(
          'h2',
          null,
          'Was this document useful?'
        ),
        React.createElement(Radio, {
          name: 'feedback-useful',
          value: 'yes',
          label: 'Yes',
          handleUpdate: this.handleUsefulFeedback,
        }),
        React.createElement(Radio, {
          name: 'feedback-useful',
          value: 'no',
          label: 'No',
          handleUpdate: this.handleUsefulFeedback,
        }),
        React.createElement(
          'div',
          { className: 'form-element' },
          React.createElement(
            'button',
            { onClick: this.handleSubmit },
            'Submit Feedback'
          )
        )
      ),
      this.state.isUseful && React.createElement(
        'div',
        { className: 'extra' },
        React.createElement(Comment, {
          name: 'comments',
          label: 'Comments',
          placeholder: 'Optional, but appreciated.',
            handleUpdate: this.handleCommentUpdate,
        })
      )
    )
  }
})

const ThankYou = React.createClass({
  render () {
    return React.createElement('div', { className: 'thankyou' }, React.createElement(
      'h2',
      null,
      'Thank you for your feedback!'
    ))
  }
})

const Feedback = React.createClass({
  getInitialState () {
    return {
      completed: false,
    }
  },
  handleSubmit () {
    this.setState({
      completed: true,
    })
  },
  render () {
    return this.state.completed ? (
      React.createElement(ThankYou)
    ) : (
      React.createElement(Form, {
        onSubmitComplete: this.handleSubmit,
      })
    )
  }
})

var root = document.getElementById('feedback')
if (root) {
  ReactDOM.render(
    React.createElement(Feedback),
    document.getElementById('feedback')
  )
}

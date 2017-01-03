var Radio = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    handleUpdate: React.PropTypes.func.isRequired,
  },

  updateValue: function (event) {
    this.props.handleUpdate(event.target.value)
  },

  render: function () {
    var name = this.props.name
    var value = this.props.value
    var label = this.props.label
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

var Comment = React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    handleUpdate: React.PropTypes.func.isRequired,
  },

  updateValue: function (event) {
    this.props.handleUpdate(event.target.value)
  },

  render: function () {
    var name = this.props.name
    var placeholder = this.props.placeholder
    var label = this.props.label
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
        placeholder: placeholder,
      })
    )
  }
})

var Form = React.createClass({
  propTypes: {
    onSubmitComplete: React.PropTypes.func.isRequired,
  },
  getInitialState: function () {
    return {
      isUseful: null,
      comment: null,
    }
  },
  handleSubmit: function () {
    if (this.state.isUseful) {
      window.newrelic.addPageAction('feedback', {
        isUseful: this.state.isUseful,
        comment: this.state.comment,
        currentPath: window.location.pathname,
        currentHash: window.location.hash,
      })
      this.props.onSubmitComplete()
    }
  },
  handleCommentUpdate: function (value) {
    this.setState({
      comment: value,
    })
  },
  handleUsefulFeedback: function (value) {
    this.setState({
      isUseful: value,
    })
  },
  render: function () {
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

var ThankYou = React.createClass({
  render: function () {
    return React.createElement('div', { className: 'thankyou' }, React.createElement(
      'h2',
      null,
      'Thank you for your feedback!'
    ))
  }
})

var Feedback = React.createClass({
  getInitialState: function () {
    return {
      completed: false,
    }
  },
  handleSubmit: function () {
    this.setState({
      completed: true,
    })
  },
  render: function () {
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

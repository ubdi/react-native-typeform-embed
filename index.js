import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { WebView } from 'react-native-webview'

class TypeformEmbed extends Component {
  onLoad = () => {
    const {
      url,
      hideHeaders,
      hideFooter,
      opacity,
      buttonText,
      mode,
      autoOpen,
      autoClose
    } = this.props

    const options = {
      hideHeaders,
      hideFooter,
      opacity,
      buttonText,
      mode,
      autoOpen,
      autoClose
    }

    if (this.typeformElm) {
      const stringifedOptions = JSON.stringify(JSON.stringify(options))
      const embedCode = `
      {
        const onSubmit = () => window.ReactNativeWebView.postMessage("onSubmit")
        const options = Object.assign({}, JSON.parse(${stringifedOptions}), {onSubmit})
        typeformEmbed.makeWidget(document.getElementById('typeform-embed'), '${url}', options)
      }
      true
      `
      this.typeformElm.injectJavaScript(embedCode)
    }
  }

  onMessage = event => {
    const { data } = event.nativeEvent
    if (data === 'onSubmit') return this.props.onSubmit()
  }

  render() {
    return (
      <WebView
        originWhitelist={['*']}
        ref={el => (this.typeformElm = el)}
        source={{
          html:
            '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://embed.typeform.com/embed.js"></script></head><div id="typeform-embed">Loading...</div></html>'
        }}
        onLoadEnd={this.onLoad}
        onMessage={this.onMessage}
      />
    )
  }
}

TypeformEmbed.propTypes = {
  style: PropTypes.object,
  url: PropTypes.string.isRequired,
  popup: PropTypes.bool,
  hideHeaders: PropTypes.bool,
  hideFooter: PropTypes.bool,

  // Widget options
  opacity: PropTypes.number,
  buttonText: PropTypes.string,

  // Popup options
  mode: PropTypes.string,
  autoOpen: PropTypes.bool,
  autoClose: PropTypes.number,
  onSubmit: PropTypes.func
}

// Default values taken from official Typeform docs
// https://developer.typeform.com/embed/modes/
TypeformEmbed.defaultProps = {
  style: {},
  popup: false,
  hideHeaders: false,
  hideFooter: false,
  onSubmit: () => {},

  // Widget options
  opacity: 100,
  buttonText: 'Start',

  // Popup options
  mode: 'popup', // options: "popup", "drawer_left", "drawer_right"
  autoOpen: false,
  autoClose: 5
}

export default TypeformEmbed

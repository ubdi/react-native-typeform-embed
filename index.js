import React, { Component } from "react";
import PropTypes from "prop-types";
import { WebView } from "react-native-webview";

class TypeformEmbed extends Component {
  onLoad = () => {
    const { url, hideHeaders, hideFooter, opacity, buttonText } = this.props;

    const options = {
      mode: "popup",
      hideHeaders,
      hideFooter,
      opacity,
      buttonText
    };

    if (this.typeformElm) {
      const stringifedOptions = JSON.stringify(JSON.stringify(options));
      const embedCode = `
      {
        const onSubmit = () => window.ReactNativeWebView.postMessage("onSubmit")
        const onClose = () => window.ReactNativeWebView.postMessage("onClose")
        const options = Object.assign({}, JSON.parse(${stringifedOptions}), {onSubmit,onClose})
        const ref = typeformEmbed.makePopup('${url}', options)
        ref.open()
      }
      true
      `;
      this.typeformElm.injectJavaScript(embedCode);
    }
  };

  onMessage = event => {
    const { data } = event.nativeEvent;
    if (data === "onSubmit") return this.props.onSubmit();
    if (data === "onClose") return this.props.onClose();
  };

  render() {
    return (
      <WebView
        originWhitelist={["*"]}
        ref={el => (this.typeformElm = el)}
        source={{
          html:
            '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://embed.typeform.com/embed.js"></script></head><div id="typeform-embed">Loading...</div></html>'
        }}
        onLoadEnd={this.onLoad}
        onMessage={this.onMessage}
        {...this.props.webView}
      />
    );
  }
}

TypeformEmbed.propTypes = {
  url: PropTypes.string.isRequired,
  style: PropTypes.object,

  // Widget options
  hideHeaders: PropTypes.bool,
  hideFooter: PropTypes.bool,
  opacity: PropTypes.number,
  buttonText: PropTypes.string,
  onSubmit: PropTypes.func
};

// Default values taken from official Typeform docs
// https://developer.typeform.com/embed/modes/
TypeformEmbed.defaultProps = {
  style: {},
  webView: {},

  // Widget options
  hideHeaders: false,
  hideFooter: false,
  opacity: 100,
  buttonText: "Start",
  onSubmit: () => {}
};

export default TypeformEmbed;

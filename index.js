import React, { Component } from "react";
import PropTypes from "prop-types";
import { WebView } from "react-native-webview";

class TypeformEmbed extends Component {
  onLoad = () => {
    const { url, hideHeaders, hideFooter, opacity, buttonText } = this.props;

    const options = {
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
        const options = Object.assign({}, JSON.parse(${stringifedOptions}), {onSubmit})
        typeformEmbed.makeWidget(document.getElementById('typeform-embed'), '${url}', options)
      }
      true
      `;
      this.typeformElm.injectJavaScript(embedCode);
    }
  };

  onMessage = event => {
    const { data } = event.nativeEvent;
    if (data === "onSubmit") return this.props.onSubmit();
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

  // Widget options
  hideHeaders: false,
  hideFooter: false,
  opacity: 100,
  buttonText: "Start",
  onSubmit: () => {}
};

export default TypeformEmbed;

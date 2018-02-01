import React, { Component } from 'react';

class LandingHeader extends Component {
  cursor = '█'; //|

  constructor() {
    super();

    this.state = {
      text:
        "{\n  name: 'Kevin Largo',\n  education: 'UC Davis',\n  degree: 'Computer Science',\n  location: 'Bay Area'\n}",
      index: 0,
      jsx: null
    };
  }

  // Start typing after delay
  componentDidMount() {
    setTimeout(this.startTypingAnimation, 1000);
  }

  startTypingAnimation = () => {
    if (!this.animationInterval)
      this.animationInterval = setInterval(this.type, 80);
  };

  // Convert substring to formatted JSX
  stringToJSX = text => {
    const completeLines = this.state.text.split('\n');
    return text.split('\n').map((line, index) => {
      // Only append cursor | when NOT atEndOfLine
      const atEndOfLine = line == completeLines[index];

      switch (line[0]) {
        case '{':
        case '}':
          return <div key={index}>{line}</div>; // Don't append &nbsp;
        default:
          return (
            <div key={index}>
              &nbsp;{line}
              {atEndOfLine ? '' : this.cursor}
            </div>
          );
      }
    });
  };

  scrollDistance = () => {
    return window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;
  };

  // Simulate typing, increment index and update JSX
  type = () => {
    const { state, stringToJSX, animationInterval, blinkCursor } = this;

    const { index, text } = state;

    if (index >= text.length) {
      clearInterval(animationInterval);
      this.setState({ index: 0, blinkCount: 0 });
      //this.animationInterval = null;
      this.animationInterval = setInterval(blinkCursor, 500);
      return;
    }

    this.setState({
      index: index + 1,
      jsx: stringToJSX(text.substring(0, index + 1))
    });
  };

  // At the end of typing, link cursor three times before disappearing
  blinkCursor = () => {
    const { state, stringToJSX } = this;
    const { blinkCount, text } = state;

    if (blinkCount >= 6) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;

      // Scroll automatically when animation completes if user hasn't scrolled yet
      if (this.scrollDistance() < 20) this.props.scrollToMain();
      return;
    }

    // Appended to landing header text as flashing cursor
    const toggledCursor = blinkCount % 2 ? '' : this.cursor;

    this.setState({
      blinkCount: blinkCount + 1,
      jsx: stringToJSX(text + toggledCursor)
    });
  };

  render() {
    // landing-header-text is removed as child so that it can float on scroll
    return (
      <div>
        <div className="landing-header" />
        <div
          className="landing-header-text"
          onClick={this.startTypingAnimation}
        >
          {this.state.jsx}
        </div>
        <div className="scrollButton" onClick={this.props.scrollToMain}>
          <div className="text">▼</div>
        </div>
      </div>
    );
  }
}

export default LandingHeader;

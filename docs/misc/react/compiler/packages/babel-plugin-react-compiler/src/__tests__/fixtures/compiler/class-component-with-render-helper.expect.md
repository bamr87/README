---
title: Class Component With Render Helper.Expect
category: misc
tags:
- javascript
last_updated: null
source_file: class-component-with-render-helper.expect.md
---
# Class Component With Render Helper.Expect

## Input

```javascript
// @compilationMode:"infer"
class Component {
  _renderMessage = () => {
    const Message = () => {
      const message = this.state.message;
      return <div>{message}</div>;
    };
    return <Message />;
  };

  render() {
    return this._renderMessage();
  }
}

```

## Code

```javascript
// @compilationMode:"infer"
class Component {
  _renderMessage = () => {
    const Message = () => {
      const message = this.state.message;
      return <div>{message}</div>;
    };
    return <Message />;
  };

  render() {
    return this._renderMessage();
  }
}

```

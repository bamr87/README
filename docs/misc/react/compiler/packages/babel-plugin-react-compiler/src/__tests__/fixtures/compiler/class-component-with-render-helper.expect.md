---
category: misc
last_updated: null
source_file: class-component-with-render-helper.expect.md
summary: "```javascript\n// @compilationMode:\"infer\"\nclass Component {\n  renderMessage\
  \ = () => {\n    const Message = () => {\n      const message = this.state.message;\n\
  \      return <div>{message}</div>;\n    };\n  ..."
tags:
- javascript
title: Class Component With Render Helper.Expect
---

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
      
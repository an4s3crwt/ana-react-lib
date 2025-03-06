import React, { Component } from 'react';
import { LogProvider } from './loggers/LogProvider';

export class ErrorBoundary extends Component {
  // Fields
  contextName = 'ErrorBoundary';
  logger = null;

  constructor(props) {
    super(props);

    this.state = {
      sourceName: this.props.sourceName,
      error: null,
      errorInfo: null
    };

    // Initialize logger here instead of directly as a class field
    this.logger = LogProvider.getLogger(this.contextName);
  }

  componentDidCatch(error, info) {
    this.setState({
      error: error,
      errorInfo: info
    });

    if (info) {
      this.logger.error(`${error && error.toString()} ${info.componentStack} @'${this.props.sourceName}'`);
    }
  }

  componentDidUpdate() {
    if (this.state.sourceName !== this.props.sourceName) {
      this.setState({
        sourceName: this.props.sourceName,
        error: null,
        errorInfo: null
      });
    }
  }

  render() {
    if (this.state.errorInfo) {
      return this.props.onRenderFallback(this.state.sourceName, this.state.error, this.state.errorInfo);
    }

    return this.props.children;
  }
}

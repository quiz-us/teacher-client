import React from 'react';
import Rollbar from 'rollbar';
const { NODE_ENV } = process.env;
console.log('ENV VA', process.env);
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rollbar: new Rollbar({
        accessToken: '57865894fff545faad16c29133dc7350',
        captureUncaught: true,
        captureUnhandledRejections: true,
        // enabled: NODE_ENV !== 'development',
        payload: {
          environment: NODE_ENV,
          client: {
            javascript: {
              source_map_enabled: true,
              code_version: '0.0.0',
              // Optionally have Rollbar guess which frames the error was thrown from
              // when the browser does not provide line and column numbers.
              guess_uncaught_frames: true,
            },
          },
        },
      }),
    };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // log the error to rollbar:
    this.state.rollbar.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

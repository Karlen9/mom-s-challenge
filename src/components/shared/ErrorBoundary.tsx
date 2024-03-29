"use client";
import React, { type ErrorInfo, type ReactNode, Suspense } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: string;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return (
        <Suspense fallback="">
          <div className="w-full flex-col h-screen flex justify-center items-center">
            <div>{this.state.error}</div>
          </div>
        </Suspense>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

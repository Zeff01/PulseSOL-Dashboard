"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-400 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-400">
            {this.state.error?.message ||
              "An error occurred while loading this component"}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

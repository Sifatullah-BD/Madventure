import React from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950">
                    <div className="max-w-md w-full text-center">
                        {/* Error Icon */}
                        <div className="relative mx-auto mb-6 w-20 h-20">
                            <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-ping opacity-20"></div>
                            <div className="relative w-20 h-20 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                <AlertTriangle size={36} className="text-red-500" strokeWidth={2} />
                            </div>
                        </div>

                        {/* Message */}
                        <h1 className="text-2xl font-heading font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Oops! Something went wrong
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                            We hit an unexpected bump in the road. Don't worry — your data is safe. Try refreshing the page.
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                            <button
                                onClick={this.handleRetry}
                                className="bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Try Again
                            </button>
                            <a
                                href="/"
                                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-full font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
                            >
                                <Home size={18} />
                                Go Home
                            </a>
                        </div>

                        {/* Collapsible Error Details */}
                        {this.state.error && (
                            <div className="text-left">
                                <button
                                    onClick={() => this.setState(prev => ({ showDetails: !prev.showDetails }))}
                                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mx-auto mb-2"
                                >
                                    <ChevronDown
                                        size={14}
                                        className={`transition-transform duration-200 ${this.state.showDetails ? 'rotate-180' : ''}`}
                                    />
                                    {this.state.showDetails ? 'Hide' : 'Show'} Error Details
                                </button>

                                {this.state.showDetails && (
                                    <div className="bg-gray-900 dark:bg-gray-800 text-gray-300 p-4 rounded-xl text-xs font-mono overflow-auto max-h-48 border border-gray-700">
                                        <p className="text-red-400 font-bold mb-2">{this.state.error.toString()}</p>
                                        <pre className="whitespace-pre-wrap text-gray-500 text-[10px]">
                                            {this.state.errorInfo?.componentStack}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

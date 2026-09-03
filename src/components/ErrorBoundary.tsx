import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F3E4C8] text-[#3F2928] font-mono flex items-center justify-center p-4">
          <div className="bg-[#FFF8EA] border-4 border-[#3F2928] shadow-[8px_8px_0px_#3F2928] max-w-lg w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3 border-b-2 border-[#3F2928] pb-4">
              <div className="p-2.5 bg-[#7A302F] text-[#FFF8EA] border border-[#3F2928]">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold uppercase text-[#3F2928]">
                  Dr. Doc Diagnostic Alert
                </h1>
                <p className="text-xs text-[#7A302F] font-bold">A display error occurred during rendering</p>
              </div>
            </div>

            <div className="bg-[#F3E4C8] border-2 border-[#3F2928] p-3 text-xs overflow-x-auto max-h-36">
              <code className="text-[#7A302F] font-bold block mb-1">
                {this.state.error?.message || 'Unknown runtime error'}
              </code>
              <pre className="text-[10px] text-[#3F2928]/70 whitespace-pre-wrap">
                {this.state.error?.stack?.slice(0, 300)}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="flex-1 bg-[#7A302F] hover:bg-[#5c2322] text-[#FFF8EA] py-2.5 px-4 font-heading font-bold text-sm border-2 border-[#3F2928] shadow-[3px_3px_0px_#3F2928] flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <a
                href="/"
                className="py-2.5 px-4 bg-[#FFF8EA] hover:bg-[#F3E4C8] text-[#3F2928] font-mono text-xs font-bold border-2 border-[#3F2928] flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

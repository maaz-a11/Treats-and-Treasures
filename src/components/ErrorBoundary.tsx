import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDF6F0] flex flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="text-6xl">😟</span>
          <h1 className="font-display text-3xl text-[#2C1810]">Something went wrong</h1>
          <p className="font-body text-sm text-[#5C3D2E] max-w-sm leading-relaxed">
            We're sorry — something unexpected happened. Please refresh the page or go back home.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => window.location.reload()}
              className="font-body font-semibold text-sm text-[#2C1810] bg-[#F2A7BB] px-6 py-3 rounded-full hover:bg-[#D4728A] hover:text-white transition-all"
            >
              Refresh Page
            </button>
            <a
              href="/"
              className="font-body font-semibold text-sm text-[#2C1810] border-2 border-[#2C1810]/20 px-6 py-3 rounded-full hover:border-[#2C1810]/40 transition-all"
            >
              Go Home
            </a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

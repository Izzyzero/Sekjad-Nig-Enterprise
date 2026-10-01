import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-white px-6 text-center">
          <div role="alert">
            <h1 className="text-2xl font-semibold">We couldn't load this page</h1>
            <p className="mt-3">Please reload the page to try again.</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-full bg-orange px-6 py-3 text-white">
              Reload page
            </button>
            <a href="/" className="ml-4 underline">Go to homepage</a>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

import { Component, type ReactNode } from "react"

type Props = { children: ReactNode; fallback?: ReactNode }

export class RoomSafe extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}

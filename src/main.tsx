import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { RoomSafe } from "@/components/room-safe"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RoomSafe
      fallback={
        <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
          <p className="text-sm tracking-[0.18em] text-muted-foreground uppercase">IIT Bombay · class of 2027</p>
          <h1 className="mt-4 font-heading text-5xl font-medium tracking-tight">Vishwajeet Natu</h1>
        </div>
      }
    >
      <App />
    </RoomSafe>
  </StrictMode>,
)

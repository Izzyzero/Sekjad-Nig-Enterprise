export function SessionLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-white" role="status" aria-label="Loading">
      <div className="relative grid size-16 place-items-center" aria-hidden="true">
        <span className="absolute inset-0 rounded-full border-4 border-orange/15" />
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-orange motion-reduce:animate-none" />
        <span className="size-3 rounded-full bg-orange" />
      </div>
      <span className="sr-only">Loading, please wait.</span>
    </div>
  )
}

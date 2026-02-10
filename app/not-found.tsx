import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-6xl font-normal mb-4 text-foreground/80">
          404
        </h1>
        <h2 className="text-2xl font-medium mb-4">
          Page not found
        </h2>
        <p className="text-muted-foreground mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium inline-block transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}

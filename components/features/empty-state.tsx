import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onCreateStudy: () => void
}

export function EmptyState({ onCreateStudy }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
      <div className="max-w-md">
        <h2 className="font-serif text-2xl mb-3 italic">
          No studies yet
        </h2>
        <p className="text-muted-foreground mb-6">
          Create your first research study to start conducting AI-moderated interviews
          and collecting rich, qualitative insights from your participants.
        </p>
        <Button size="lg" onClick={onCreateStudy}>
          Create Your First Study
        </Button>
      </div>
    </div>
  )
}

import { LoadingSpinner } from "@/components/loading-spinner"

export default function SearchLoading() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

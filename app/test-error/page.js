import ErrorTest from '@/components/test/ErrorTest'

export const metadata = {
  title: 'Error Boundary Test',
  description: 'Testing the ErrorBoundary component',
}

export default function TestErrorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Error Boundary Test Page</h1>
      <ErrorTest />
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to test:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Click the &quot;Trigger Error&quot; button in the component above</li>
          <li>The ErrorBoundary should catch the error and display a friendly message</li>
          <li>Click &quot;Try Again&quot; to reset the component</li>
        </ol>
      </div>
    </div>
  )
} 
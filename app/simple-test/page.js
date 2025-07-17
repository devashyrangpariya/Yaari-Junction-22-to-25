import SimpleErrorTest from '@/components/test/SimpleErrorTest'

export const metadata = {
  title: 'Simple Error Boundary Test',
  description: 'Testing the ErrorBoundary component with a simple example',
}

export default function SimpleTestPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Simple Error Boundary Test</h1>
      <SimpleErrorTest />
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">What&apos;s happening:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>The component on the left throws an error in componentDidMount</li>
          <li>The ErrorBoundary catches this error and displays a friendly message</li>
          <li>The component on the right continues to work normally</li>
          <li>This demonstrates that the ErrorBoundary is working correctly</li>
        </ul>
      </div>
    </div>
  )
} 
import AnimationDemo from '../../components/animations/AnimationDemo';

export default function AnimationDemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Animation System Demo
        </h1>
        <AnimationDemo />
      </div>
    </div>
  );
}
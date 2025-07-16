'use client';

import { motion } from 'framer-motion';
import { FadeIn, ScrollFadeIn, StaggeredFadeIn } from './FadeIn';
import { HoverZoom, ImageHover, ButtonHover, CardHover } from './HoverZoom';
import { Slideshow } from './Slideshow';
import { AnimatedText, FloatingElement, LoadingAnimation } from './AnimationUtils';

// Demo component to showcase the animation system
export default function AnimationDemo() {
  const demoImages = [
    '/images/demo1.jpg',
    '/images/demo2.jpg',
    '/images/demo3.jpg'
  ];

  const demoItems = [
    'First animated item',
    'Second animated item', 
    'Third animated item',
    'Fourth animated item'
  ];

  return (
    <div className="space-y-12 p-8">
      {/* Animated Text Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Animated Text</h2>
        <AnimatedText 
          text="Welcome to the College Memory Gallery Animation System"
          className="text-lg text-gray-700"
        />
      </section>

      {/* Fade In Animations Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Fade In Animations</h2>
        <div className="grid grid-cols-2 gap-4">
          <FadeIn direction="fromLeft">
            <div className="bg-blue-100 p-4 rounded-lg">
              <p>Fade in from left</p>
            </div>
          </FadeIn>
          <FadeIn direction="fromRight">
            <div className="bg-green-100 p-4 rounded-lg">
              <p>Fade in from right</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Scroll Triggered Animations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Scroll Triggered Animations</h2>
        <ScrollFadeIn>
          <div className="bg-purple-100 p-6 rounded-lg">
            <p>This element animates when it comes into view</p>
          </div>
        </ScrollFadeIn>
      </section>

      {/* Staggered Animations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Staggered List Animation</h2>
        <StaggeredFadeIn>
          {demoItems.map((item, index) => (
            <div key={index} className="bg-gray-100 p-3 rounded mb-2">
              {item}
            </div>
          ))}
        </StaggeredFadeIn>
      </section>

      {/* Hover Effects Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Hover Effects</h2>
        <div className="grid grid-cols-3 gap-4">
          <HoverZoom>
            <div className="bg-red-100 p-4 rounded-lg cursor-pointer">
              <p>Basic Hover Zoom</p>
            </div>
          </HoverZoom>
          
          <ButtonHover>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
              Button Hover Effect
            </button>
          </ButtonHover>
          
          <CardHover>
            <div className="bg-yellow-100 p-4 rounded-lg cursor-pointer">
              <p>3D Card Hover</p>
            </div>
          </CardHover>
        </div>
      </section>

      {/* Floating Element Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Floating Animation</h2>
        <FloatingElement>
          <div className="bg-indigo-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
            <span>Float</span>
          </div>
        </FloatingElement>
      </section>

      {/* Loading Animations Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Loading Animations</h2>
        <div className="flex space-x-8 items-center">
          <div className="text-center">
            <LoadingAnimation type="spinner" size="md" color="blue" />
            <p className="mt-2 text-sm">Spinner</p>
          </div>
          <div className="text-center">
            <LoadingAnimation type="dots" size="md" color="green" />
            <p className="mt-2 text-sm">Dots</p>
          </div>
          <div className="text-center">
            <LoadingAnimation type="pulse" size="md" color="purple" />
            <p className="mt-2 text-sm">Pulse</p>
          </div>
        </div>
      </section>

      {/* Slideshow Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Slideshow Component</h2>
        <div className="max-w-2xl">
          <Slideshow 
            images={[
              <div key="1" className="bg-gradient-to-r from-blue-400 to-purple-500 h-64 flex items-center justify-center text-white text-xl">Slide 1</div>,
              <div key="2" className="bg-gradient-to-r from-green-400 to-blue-500 h-64 flex items-center justify-center text-white text-xl">Slide 2</div>,
              <div key="3" className="bg-gradient-to-r from-purple-400 to-pink-500 h-64 flex items-center justify-center text-white text-xl">Slide 3</div>
            ]}
            autoPlay={true}
            interval={3000}
            showControls={true}
            showIndicators={true}
          />
        </div>
      </section>
    </div>
  );
}
"use client"
import type React from "react"
import { WobbleCard } from "./ui/wobble-card"
import { Zap, Shield, Rocket, NotepadText, Stethoscope, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { ColourfulText } from "./ui/colourful-text"
import { ContainerScroll } from "./ui/feature-card-scroll-animation"
import { LampContainer } from "./ui/Lamp"

type FeatureProps = {
  title: string
  description: string
  bgColor: string
  icon?: React.ReactNode
  imageUrl?: string
  imageAlt?: string
  className?: string
}

const Feature = ({
  title,
  description,
  bgColor,
  icon,
  imageUrl,
  imageAlt = "Feature illustration",
  className,
}: FeatureProps) => {
  return (
    <WobbleCard containerClassName={`${bgColor} h-full ${className}`}>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          {icon && <div className="mb-6 text-white/80">{icon}</div>}
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">{title}</h3>
          <p className="text-white/80 text-sm sm:text-base mb-4">{description}</p>
        </div>
        {imageUrl && (
          <div className="mt-auto">
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        )}
      </div>
    </WobbleCard>
  )
}

export function FeatureCards() {
  return (
    <ContainerScroll
      titleComponent={
        <h2 className="text-4xl sm:text-5xl font-bold font-inter leading-tight text-white">
          Why Choose <span className="text-blue-400">SonicScribe</span>?
        </h2>
      }>
    <div className="w-full max-w-7xl mx-auto py-4">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left Side */}
        <div className="lg:w-1/3 text-center lg:text-left space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold font-inter leading-tight">
            Built for <ColourfulText text="People." /> <br /> Designed for scale.
          </h2>
          <p className="text-gray-600 text-lg font-inter">
            SonicScript AI helps teams move fast, build efficiently, and scale across platforms with confidence.
          </p>
          <button className="mt-4 px-6 py-3 bg-blue-700 text-white rounded-xl shadow hover:bg-blue-800 transition font-inter">
            Get Started
          </button>
        </div>

        {/* Right Side */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full font-inter">
          <Feature
            title="Smart Symptom Checker"
            description="Analyze symptoms, prioritize care, and connect patients to the right doctors using an AI-powered virtual assistant."
            bgColor="bg-gradient-to-br from-pink-600 to-pink-800"
            icon={<Stethoscope size={32} />}
          />
          <Feature
            title="Predictive Risk Insights"
            description="Forecast readmissions and calculate personalized risk scores with intelligent predictive models."
            bgColor="bg-gradient-to-br from-purple-600 to-purple-800"
            icon={<ShieldCheck size={32} />}
          />
          <Feature
            title="Auto Clinical Notes with NLP"
            description="Generate accurate clinical documentation in real-time using voice recognition and natural language processing."
            bgColor="bg-gradient-to-br from-blue-600 to-blue-800"
            icon={<NotepadText size={32} />}
            className="md:col-span-2"
          />
        </div>
      </div>
    </div>
    </ContainerScroll>
  )
}

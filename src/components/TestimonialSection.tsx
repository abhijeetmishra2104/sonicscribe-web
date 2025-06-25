"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/infinite-moving-card";

const testimonials = [
  {
    quote: "SonicScribe transformed the way our clinic handles documentation. It’s fast, reliable, and easy to use.",
    name: "Dr. Aisha Verma",
    title: "Cardiologist, Medilife Hospital",
  },
  {
    quote: "The AI-powered symptom checker has helped reduce patient wait times and improved triage accuracy.",
    name: "Dr. Ryan Patel",
    title: "General Practitioner",
  },
  {
    quote: "The predictive insights helped us identify high-risk patients and intervene early—this saved lives.",
    name: "Dr. Meera Srinivasan",
    title: "Chief Medical Officer, HealthFirst",
  },
  {
    quote: "Our admin team loves the automatic clinical notes feature. It's like having an extra staff member.",
    name: "Dr. Luis Gonzalez",
    title: "Orthopedic Surgeon",
  },
  {
    quote: "Integrating SonicScribe was seamless. Their team supported us every step of the way.",
    name: "Dr. Karen Zhao",
    title: "Hospital Director, Green Valley",
  },
];

export const TestimonialSection = () => {
  return (
    <section className="w-full  dark:bg-black py-16 px-4 font-inter">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-bold dark:text-white">
          What Our Users Say
        </h2>
        <p className="mt-4 text-lg  dark:text-gray-400">
          Trusted by doctors, hospitals, and clinics around the world.
        </p>
      </div>
      <InfiniteMovingCards items={testimonials} direction="left" speed="normal" />
    </section>
  );
};

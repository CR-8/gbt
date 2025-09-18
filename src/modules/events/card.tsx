import React from 'react'
import Image from 'next/image'

interface Feature {
  id: string;
  subtitle: string;
  title: string;
  image: string;
  description: string;
}

interface CardProps {
  heading: string;
  features: Feature[];
}

export default function Card({ heading, features}: CardProps) {
  return (
    <section className={`py-32`}>
      <div className="container max-w-7xl">
        <h2 className="text-[10vw] font-bold">{heading}</h2>
        <div className="mt-20 grid gap-9 lg:grid-cols-2 ">
          {features.map((feature: Feature) => (
            <div
              key={feature.id}
              className="w-full flex flex-col justify-between rounded-lg bg-accent"
            >
                <div className="flex justify-center gap-10 border-neutral-500 border-b">
                  <div className="flex flex-col justify-between gap-14 py-6 pl-4 md:py-10 md:pl-8 lg:justify-normal">
                    <p className="text-xs text-muted-foreground">
                      {feature.subtitle}
                    </p>
                    <h3 className="text-2xl md:text-4xl">{feature.title}</h3>
                  </div>
                  <div className="md:1/3 w-2/5 shrink-0 rounded-r-lg border-l border-neutral-500">
                    <img
                      src={`https://plus.unsplash.com/premium_photo-1744607693346-5d31a2a15733?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
                      alt={feature.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="p-4 text-muted-foreground md:p-8">
                  {feature.description}
                </div>
              </div>
          ))}
        </div>
      </div>
    </section>
  )
}

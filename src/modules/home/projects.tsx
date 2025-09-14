"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Lenis from "lenis";

const projects = [
  {
    id: 1,
    title: "Airawat – Semi-Vertical Drum Combat Robot",
    imageUrl: `/project/Airawat1.jpg`,
    description:
      "Lightweight yet durable Aluminium T6 alloy chassis with AR500 paneling. Semi-vertical drum weapon tuned for high-impact energy transfer.",
    materials: {
      Chassis: "Aluminium T6 Alloy",
      Panels: "AR500",
      Wheels: "Collson Rubber Wheels",
    },
    weaponSystem: "Semi-Vertical Drum (high-impact, high-speed configuration)",
    driveSystem: ["Inginium P2 10 Gearbox", "H700 Motor", "Secure 120A ESC"],
    highlights: [
      "Aluminium T6 chassis for structural integrity",
      "AR500 panels resist heavy strikes",
      "Semi-vertical drum ensures high kinetic energy transfer",
      "Balanced torque and speed for competitive endurance",
    ],
    tags: ["Durable", "High-Impact", "Competitive"],
  },
  {
    id: 2,
    title: "Sharanga – Double-Disk Combat Robot",
    imageUrl: `/project/Sharanga1.jpg`,
    description:
      "Rugged Aluminium T6 chassis with AR500 paneling for maximum durability. Semi-vertical drum weapon engineered for precision hits.",
    materials: {
      Chassis: "Aluminium T6 Alloy",
      Panels: "AR500",
      Wheels: "Collson Rubber Wheels",
    },
    weaponSystem: "Semi-Vertical Drum",
    driveSystem: ["Inginium P219 Gearbox", "Turbo Motors", "Secure 120A ESC"],
    highlights: [
      "AR500 paneling for high-impact durability",
      "Precision-tuned semi-vertical drum weapon",
      "P219 gearbox + turbo motors for rapid acceleration",
      "Enhanced grip and maneuverability with Collson wheels",
    ],
    tags: ["Rugged", "Precision", "Agile"],
  },
];

const Project = () => {
  return (
    <div
      className="flex flex-col items-start justify-start mt-12 z-30 p-4"
    >
      <h1 className="text-[10vw] md:text-[6vw] font-bold mb-12 text-center w-full">
        Our Projects
      </h1>
      <div className="w-full p-4 gap-8 space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex p-8 items-center bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700 transition-transform duration-300 hover:shadow-2xl"
          >
            <div className="image-container w-full h-[50vh] relative mb-4">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover rounded-lg transition-transform duration-500"
              />
            </div>
            <div className="p-6 w-full">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                {project.title}
              </h2>
              <p className="text-gray-300 text-center mb-6">
                {project.description}
              </p>
              <div className="text-sm text-gray-400 space-y-4">
                <p>
                  <strong className="text-white">Materials:</strong>{" "}
                  {Object.entries(project.materials)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")}
                </p>
                <p>
                  <strong className="text-white">Weapon System:</strong>{" "}
                  {project.weaponSystem}
                </p>
                <p>
                  <strong className="text-white">Drive System:</strong>{" "}
                  {project.driveSystem.join(", ")}
                </p>
                <p>
                  <strong className="text-white">Highlights:</strong>{" "}
                  {project.highlights.join(", ")}
                </p>
                <p>
                  <strong className="text-white">Tags:</strong>{" "}
                  {project.tags.join(", ")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Project;
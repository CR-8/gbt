"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());

  const toggleProjectExpansion = (projectId: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const isExpanded = (projectId: number) => expandedProjects.has(projectId);
  return (
    <div className="flex flex-col items-start justify-start mt-8 sm:mt-12 z-30 px-4 sm:px-6 lg:px-8">
      <h1 className="text-[10vw] md:text-[6vw] font-bold mb-8 sm:mb-12 text-center w-full">
        Our Projects
      </h1>
      <div className="w-full max-w-7xl mx-auto">
        <div className="space-y-6 sm:space-y-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border border-neutral-700 transition-transform duration-300"
            >
              {/* Mobile: Stack vertically, Desktop: Side by side */}
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-[50vh] relative">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500"
                  />
                </div>

                {/* Content Section */}
                <div className="p-4 sm:p-6 lg:p-8 w-full lg:w-1/2 flex flex-col justify-center">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 text-center lg:text-left">
                    {project.title}
                  </h2>

                  <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 text-center lg:text-left leading-relaxed">
                    {project.description}
                  </p>

                  {/* Read More Button - Only visible on mobile */}
                  <div className="flex justify-center lg:hidden mb-2">
                    <button
                      onClick={() => toggleProjectExpansion(project.id)}
                      className="flex items-center gap-2 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                    >
                      {isExpanded(project.id) ? (
                        <>
                          Read Less
                          <ChevronUp className="w-2 h-2" />
                        </>
                      ) : (
                        <>
                          Read More
                          <ChevronDown className="w-2 h-2" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Expandable Details - Collapsed on mobile by default */}
                  <div
                    className={`lg:block overflow-hidden transition-all duration-500 ease-in-out ${
                      isExpanded(project.id)
                        ? 'max-h-[80vh] opacity-100'
                        : 'lg:max-h-none lg:opacity-100 max-h-0 opacity-0'
                    }`}
                  >
                    <div className="text-xs sm:text-sm text-gray-400 space-y-3 sm:space-y-4 pt-4 border-t border-neutral-600 lg:border-t-0 lg:pt-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <strong className="text-white text-sm sm:text-base whitespace-nowrap">Materials:</strong>
                        <span className="text-left">
                          {Object.entries(project.materials)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                        <strong className="text-white text-sm sm:text-base whitespace-nowrap">Weapon System:</strong>
                        <span className="text-left">{project.weaponSystem}</span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                        <strong className="text-white text-sm sm:text-base whitespace-nowrap">Drive System:</strong>
                        <span className="text-left">{project.driveSystem.join(", ")}</span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <strong className="text-white text-sm sm:text-base block">Highlights:</strong>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          {project.highlights.map((highlight, index) => (
                            <li key={index} className="text-left">{highlight}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <strong className="text-white text-sm sm:text-base">Tags:</strong>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-neutral-700 text-gray-300 px-2 py-1 rounded-full text-xs sm:text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Project;
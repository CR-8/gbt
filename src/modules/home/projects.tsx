"use client";

import { Deck, DeckCards, DeckEmpty, DeckItem } from "@/components/ui/kibo-ui/deck";
import Image from "next/image";

const images = [
  {
    id: 1,
    src: "/project/Airawat1",
    title: "Airawat",
  },
  {
    id: 2,
    src: "/project/Sharanga1",
    title: "Sharanga",
  }
];

const Project = () => (
  <Deck className="size-full">
    <DeckCards>
      {images.map((image) => (
        <DeckItem className="p-0" key={image.id}>
          <Image
            alt={image.title}
            className="h-full w-full rounded-lg object-cover"
            draggable={false}
            height={600}
            src={image.src}
            unoptimized
            width={400}
          />
        </DeckItem>
      ))}
    </DeckCards>
    <DeckEmpty />
  </Deck>
);

export default Project;

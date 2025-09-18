'use client';

import React, { useEffect, useState } from 'react';
import Card from './card';
import { eventsAPI } from '@/lib/apiService';

interface Event {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  registrations: number;
  maxCapacity: number;
  poster: string;
  subEvents?: Array<{
    id: number;
    name: string;
    description: string;
    maxTeams: number;
    registered: number;
  }>;
}

interface Feature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

function Grid() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await eventsAPI.getAll();
        setEvents(response.events || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Transform events data to match Feature interface
  const transformEventsToFeatures = (events: Event[]): Feature[] => {
    return events.map(event => ({
      id: `event-${event.id}`,
      title: event.name,
      subtitle: event.status.toUpperCase(),
      description: event.description,
      image: event.poster || '/images/event-placeholder.jpg'
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
        <span className="ml-2 text-gray-600">Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <p className="text-lg">❌ Error loading events</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const features = transformEventsToFeatures(events);

  return (
    <div>
        <Card
        heading="Featured Events"
        features={features.length > 0 ? features : [
          {
            id: "no-events",
            title: "No Events Available",
            subtitle: "COMING SOON",
            description: "Check back later for upcoming robotics events and workshops.",
            image: "/images/event-placeholder.jpg"
          }
        ]}
      />
      <Card
        heading="Upcoming Events"
        features={features.length > 0 ? features : [
          {
            id: "no-events",
            title: "No Events Available",
            subtitle: "COMING SOON",
            description: "Check back later for upcoming robotics events and workshops.",
            image: "/images/event-placeholder.jpg"
          }
        ]}
      />
      <Card
        heading="Past Events"
        features={features.length > 0 ? features : [
          {
            id: "no-events",
            title: "No Events Available",
            subtitle: "COMING SOON",
            description: "Check back later for upcoming robotics events and workshops.",
            image: "/images/event-placeholder.jpg"
          }
        ]}
      />
    </div>
  );
}

export default Grid;
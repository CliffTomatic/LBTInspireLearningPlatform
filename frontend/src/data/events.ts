import type { Event } from '../components/EventCard/EventCard';

export const mockEvents: Event[] = [
    {
        id: 1,
        dates: 'May 1 & 8, 2026',
        time: '10:00AM – 2:00PM',
        locationName: 'Hawthorne Library',
        address: '12700 Grevillea Ave, Hawthorne, CA 90250',
        level: 'Intermediate',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
        registrationUrl: '#',
        status: 'active',
    },
    {
        id: 2,
        dates: 'May 10, 2026',
        time: '12:00PM – 4:00PM',
        locationName: 'Sunkist Library',
        address: '840 Puente Avenue, La Puente, CA 91746',
        level: 'Basics',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
        registrationUrl: '#',
        status: 'postponed',
    },
    {
        id: 3,
        dates: 'May 18, 2026',
        time: '10:00AM – 6:00PM',
        locationName: 'Baldwin Park Library',
        address: '4181 Baldwin Park Blvd, Baldwin Park, CA 91706',
        level: 'Basics',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
        registrationUrl: '#',
        status: 'canceled',
    },
];

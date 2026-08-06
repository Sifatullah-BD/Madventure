import { useRouter } from 'next/router';
import { useTourDetail } from '@/hooks/useTourDetail';
import Image from 'next/image';
import Head from 'next/head';

export default function TourDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { tour, loading, error } = useTourDetail(slug);

  if (loading) return <div className="flex items-center justify-center h-screen"><span className="text-gray-600">Loading tour details...</span></div>;
  if (error) return <div className="p-8 text-red-600">Error loading tour: {error.message}</div>;
  if (!tour) return null;

  return (
    <>
      <Head>
        <title>{tour.title} – Madventure</title>
        <meta name="description" content={tour.short_description} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white p-6">
        <div className="max-w-4xl mx-auto glassmorphism bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
          <p className="text-lg mb-6">{tour.long_description}</p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Location</h2>
              <p>{tour.places?.name}</p>
              <p className="text-sm text-gray-300">{tour.places?.address}, {tour.places?.city}, {tour.places?.country}</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Price</h2>
              <p className="text-2xl font-bold">${tour.price}</p>
              <p className="text-sm text-gray-300">Duration: {tour.duration_minutes} minutes</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4">Available Schedules</h2>
          <div className="space-y-4">
            {tour.tour_schedules?.length ? (
              tour.tour_schedules.map((schedule) => (
                <div key={schedule.id} className="flex justify-between items-center bg-white/5 rounded-lg p-4 hover:bg-white/10 transition">
                  <div>
                    <p className="font-medium">{new Date(schedule.start_timestamp).toLocaleString()}</p>
                    <p className="text-sm text-gray-300">Ends: {new Date(schedule.end_timestamp).toLocaleString()}</p>
                  </div>
                  <a href={`/booking/${schedule.id}`} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition">Book Now</a>
                </div>
              ))
            ) : (
              <p className="text-gray-300">No schedules available.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Add lightweight glassmorphism utilities via Tailwind (if not present, ensure tailwind config includes these utilities)

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center mt-16">
      <h2 className="text-5xl font-bold mb-6 tracking-tight">Accelerate Your Career</h2>
      <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12">
        Join our network of top professionals. Apply for open positions and take the next big step in your career journey.
      </p>
      
      <div className="flex gap-6">
        <Link 
          href="/apply"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-transform hover:scale-105"
        >
          Apply Now
        </Link>
        <Link 
          href="/profile"
          className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50 px-8 py-4 rounded-lg font-bold text-lg transition-transform hover:scale-105"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

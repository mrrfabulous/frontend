import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Calendar, MapPin, Loader2, Filter } from 'lucide-react';
import { Train } from '../types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { mockTrains, CITIES } from '../data/mockData';

const searchSchema = z.object({
  from: z.string().min(2, 'Please enter departure city'),
  to: z.string().min(2, 'Please enter destination city'),
  date: z.string().min(1, 'Please select a date'),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  class: z.enum(['all', 'economy', 'business', 'first']).default('all'),
  recurring: z.boolean().default(false),
  recurringFrequency: z.enum(['daily', 'weekly', 'monthly']).optional()
}).refine(data => data.from !== data.to, {
  message: "Departure and destination cities cannot be the same",
  path: ["to"]
});

type SearchForm = z.infer<typeof searchSchema>;

export default function Search() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Train[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      class: 'all',
      recurring: false
    }
  });

  const recurring = watch('recurring');

  const onSubmit = async (data: SearchForm) => {
    setIsSearching(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      let results = mockTrains.filter(train => 
        train.from.toLowerCase().includes(data.from.toLowerCase()) &&
        train.to.toLowerCase().includes(data.to.toLowerCase())
      );

      // Apply filters
      if (data.minPrice) {
        results = results.filter(train => train.price >= Number(data.minPrice));
      }
      if (data.maxPrice) {
        results = results.filter(train => train.price <= Number(data.maxPrice));
      }
      if (data.class !== 'all') {
        results = results.filter(train => train.class.includes(data.class));
      }
      
      if (results.length === 0) {
        toast.error('No trains found for the selected criteria');
      } else {
        setSearchResults(results);
        toast.success(`Found ${results.length} trains`);
      }
    } catch (error) {
      toast.error('Failed to search trains. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleBooking = (trainId: string) => {
    navigate(`/booking/${trainId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Search Trains</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <Filter className="h-5 w-5 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  {...register('from')}
                  className="pl-10 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                >
                  <option value="">Select departure city</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              {errors.from && (
                <p className="mt-1 text-sm text-red-600">{errors.from.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  {...register('to')}
                  className="pl-10 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                >
                  <option value="">Select destination city</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              {errors.to && (
                <p className="mt-1 text-sm text-red-600">{errors.to.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  {...register('date')}
                  className="pl-10 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Range (₦)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    {...register('minPrice')}
                    placeholder="Min"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    {...register('maxPrice')}
                    placeholder="Max"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  {...register('class')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Classes</option>
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>

              <div className="col-span-full">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('recurring')}
                    id="recurring"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                    Recurring Booking
                  </label>
                </div>

                {recurring && (
                  <select
                    {...register('recurringFrequency')}
                    className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSearching}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <SearchIcon className="h-5 w-5 mr-2" />
                Search Trains
              </>
            )}
          </button>
        </form>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          {searchResults.map((train) => (
            <div
              key={train.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{train.name}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-gray-600">
                      From: <span className="font-medium">{train.from}</span>
                    </p>
                    <p className="text-gray-600">
                      To: <span className="font-medium">{train.to}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {train.class.map((cls) => (
                      <span
                        key={cls}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {cls.charAt(0).toUpperCase() + cls.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">₦{train.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    {train.availableSeats} seats available
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Departure: {new Date(train.departureTime).toLocaleTimeString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Arrival: {new Date(train.arrivalTime).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => handleBooking(train.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
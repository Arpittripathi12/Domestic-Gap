import { ChevronDown, MapPin, Search } from "lucide-react";

export default function SearchServices() {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center gap-3 mt-4 sm:mt-10 px-4 sm:px-0">
      {/* Location Box */}
      <div className="flex gap-2 border-2 border-black rounded-xl px-3 sm:px-4 py-4 w-full sm:fit-content bg-white shadow-sm">
        <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 flex-shrink-0 text-green-500" />
        <span className="text-gray-700 text-xs sm:text-sm whitespace-nowrap">Gomti Nagar</span>
        <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5 text-gray-500 ml-2 flex-shrink-0" />
      </div>

      {/* Search Box */}
      <div className="flex gap-2 border-2 border-black rounded-full px-3 sm:px-4 py-4 w-full bg-white shadow-sm">
        <Search className="w-5 sm:w-6 h-5 sm:h-6 text-gray-500 flex-shrink-0 text-green-500" />
        <input
          type="text"
          placeholder="Search for Cleaning, AC-Services, Chef..."
          className="outline-none text-xs sm:text-sm text-gray-700  placeholder:text-gray-500"
        />
      </div>
    </div>
  );
}

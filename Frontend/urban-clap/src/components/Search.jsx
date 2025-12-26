import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ServiceSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getServiceCategories = () => {
    return [
      {
        id: 1,
        name: "Home Cleaning",
        keywords: ["cleaning", "clean", "house cleaning", "maid", "sweeping", "mopping", "dusting",]
      },
      {
        id: 2,
        name: "Electrician",
        keywords: ["electrician", "wiring", "switch", "fan", "ac", "electrical", "lights", "power","AC and appliance Repair"]
      },
      {
        id: 3,
        name: "Carpenter",
        keywords: ["wood", "furniture", "carpentry", "door", "table", "cabinet", "wooden", "repair"]
      },
      {
        id: 4,
        name: "Chef",
        keywords: ["chef", "cook", "cooking", "food", "catering", "meal", "kitchen", "recipe"]
      },
      {
        id: 5,
        name: "Painter",
        keywords: ["painter", "painting", "paint", "wall", "color", "brush", "whitewash", "putty"]
      },
      {
        id: 6,
        name: "Plumber",
        keywords: ["plumber", "plumbing", "pipe", "leak", "tap", "water", "drain", "bathroom", "toilet"]
      }
    ];
  };

  const searchServices = (query) => {
    if (!query.trim()) {
      return [];
    }
    
    const services = getServiceCategories();
    const lowerQuery = query.toLowerCase();
    
    return services.filter(service => 
      service.keywords.some(keyword => 
        keyword.includes(lowerQuery) || lowerQuery.includes(keyword)
      ) || 
      service.name.toLowerCase().includes(lowerQuery)
    );
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const matchedServices = searchServices(searchQuery);

  return (
    <div className="z-100">
       <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
      
      <input
        type="text"
        size={40}
        value={searchQuery}
        onChange={handleSearchChange}
      
        placeholder="Search for Home-Cleaning, Carpenter, Chef..."
        className="
          w-full pl-12 pr-4 py-3 
          bg-white 
          border border-black 
          rounded-full
          focus:outline-none
        "
      />
    </div>
      

        {/* Matched Services Dropdown */}
        {searchQuery && matchedServices.length > 0 && (
          <div className="mt-2 space-y-2  max-h-40 overflow-y-auto ">
            {matchedServices.map(service => (
              <div
                key={service.id}
                className=" px-4 py-1 bg-white border rounded-xl cursor-pointer"
                onClick={() => {
                  setSearchQuery(service.name);
                  if(service.name==="Electrician"){
                    navigate("/services/Ac and Appliance Repair")
                  }
                  else{
                    navigate(`/services/${service.name}`)
                  }
                  
                }}
              >
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className=" font-semibold text-gray-800">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {service.keywords.slice(0, 4).join(' • ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {searchQuery && matchedServices.length === 0 && (
          <div className="mt-2 bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">
              No services found for "<span className="font-semibold">{searchQuery}</span>"
            </p>
          </div>
        )}
      </div>
    
  );
};

export default ServiceSearch;
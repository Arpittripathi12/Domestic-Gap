import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import acImg from "../assets/acImg.png";
import cleaningImg from "../assets/cleaningImg.png";
import chefImg from "../assets/chefImg.png";
import plumberImg from "../assets/plumberImg.png";
import carpenterImg from "../assets/carpenterImg.png";
import painterImg from "../assets/painterImg.png";

const services = [
  {
    title: "AC & Appliance Repair",
    image: acImg,
    url: "AC & Appliances Repair",
  },
  {
    title: "Home Cleaning",
    image: cleaningImg,
    url: "Home Cleaning",
  },
  {
    title: "Chef",
    image: chefImg,
    url: "Chef",
  },
  {
    title: "Plumber",
    image: plumberImg,
    url: "Plumber",
  },
  {
    title: "Carpenter",
    image: carpenterImg,
    url: "Carpenter",
  },
  {
    title: "Painter",
    image: painterImg,
    url: "Painter",
  },
];

const ServicesGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full py-6 sm:py-10 px-4" id="Services">
      {/* Heading */}
      <div className="text-center mb-6 sm:mb-10">
        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Our <span className="text-blue-600">Services</span>
        </h2>
        <p className="text-gray-800 mt-2 text-sm sm:text-lg md:text-xl lg:text-2xl px-4">
          Book expert home services instantly with trusted professionals.
        </p>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8 px-2 sm:px-4">
        {services.map((item, i) => (
          <motion.div
            key={i}
            onClick={() => navigate(`/services/${item.url}`)}
            variants={{
              initial: {
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
              },
              hover: {  
                backgroundColor: "#61ea6dff",
                borderColor: "#000000",
                boxShadow: "0 0 20px rgba(37,99,235,0.6)",
                scale: 1.05,
              },
            }}
            initial="initial"
            whileHover="hover"
            transition={{ duration: 0.3 }}
            className="cursor-pointer p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl border shadow-sm group"
          >
            
            <div className="flex justify-center mb-2 sm:mb-4">
              <motion.img
                src={item.image}
                alt={item.title}
                className="h-12 sm:h-16 md:h-20"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            
            <motion.h3
              variants={{
                initial: { color: "#1f2937" },
                hover: { color: "#fff" },
              }}
              className="text-center text-xs sm:text-sm md:text-lg font-semibold"
            >
              {item.title}
            </motion.h3>

          
            <motion.p
              variants={{
                initial: { color: "#2563eb" },
                hover: { color: "#ffffffff" },
              }}
              className="text-center font-medium mt-1 sm:mt-2 text-xs sm:text-sm"
            >
              Book Now
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid;

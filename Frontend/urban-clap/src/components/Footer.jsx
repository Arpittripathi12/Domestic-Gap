import React from "react";
import { color, motion } from "framer-motion";

export default function Footer() {
  const links = [
    { title: "Contact Us", href: "#" },
    { title: "Support", href: "#" },
    { title: "Privacy Policy", href: "#" },
    { title: "Terms & Conditions", href: "#" },
    
    
  ];

  return (
    <footer className="w-full bg-white py-8 sm:py-12 px-4 sm:px-6 flex flex-col items-center gap-6 sm:gap-12 mt-10">
      {/* Contact Section */}
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <p className="text-gray-600 font-medium text-lg sm:text-xl lg:text-2xl text-center">Feel free to reach us at:</p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 sm:gap-3 bg-[#F4F7F9] border px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:shadow-md cursor-pointer"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/3178/3178158.png" className="h-6 sm:h-8 w-6 sm:w-8"/>
          <span className="text-gray-700 font-semibold text-sm sm:text-base">help@domestic-gap.com</span>
        </motion.div>
      </div>

      {/* Line */}
      <div className="w-full border"></div>

      <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-md font-medium">
        {links.map((item, index) => (
          <motion.a
            key={index}
            href={item.href}
            className="text-center text-sm sm:text-lg lg:text-xl no-underline text-black rounded-full hover:text-green-600 transition-colors"
            style={{ textDecoration: "none" }}
          >
            {item.title}
          </motion.a>
        ))}
      </div>

      <div className="flex gap-4 sm:gap-6 mt-2 sm:mt-4">
        {["in", "f", "📸"].map((icon, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.15 }}
            className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center bg-black text-white rounded-full cursor-pointer text-lg sm:text-xl"
          >
            {icon === "in" ? "in" : icon === "f" ? "f" : icon}
          </motion.div>
        ))}
      </div>

      {/* Copyright */}
      <p className="text-green-600 font-semibold mt-2 sm:mt-4 text-sm sm:text-base">Domestic-Gap © 2025</p>

      
    </footer>
  );
}

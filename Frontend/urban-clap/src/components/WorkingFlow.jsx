import React from "react";
import { motion } from "framer-motion";

export default function WorkingFlow() {
  const steps = [
    {
      step: "STEP 1",
      title: "Search for Services",
      desc: "Find the exact home service you need with ease.",
    },
    {
      step: "STEP 2",
      title: "Choose Your Worker",
      desc: "Select the best worker based on price, ratings, and distance.",
    },
    {
      step: "STEP 3",
      title: "Book Services Instantly",
      desc: "Confirm your booking securely with transparent pricing.",
    },
    {
      step: "STEP 4",
      title: "Track & Get Service",
      desc: "Track your worker in real-time until the job is done!",
    },
  ];

  return (
    <div className="w-full py-10 sm:py-16 lg:py-20 bg-white flex flex-col items-center px-4">
        <div className="w-full py-2 bg-white flex flex-col items-center" id="HowItWorks">
  <div className="text-sm sm:text-lg lg:text-xl font-bold px-3 sm:px-4 py-2 text-center rounded-full bg-color-F4F7F9 border flex items-center gap-2 sm:gap-3">
    
    <img
      src="https://framerusercontent.com/images/QarR7jCeWZ8qrL80Ay7uhECzto.svg?width=20&height=20"
      className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6"
    />

    <div>
      How it works
    </div>

  </div>
</div>

      
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold p-4 sm:p-6 lg:p-10 text-center">
        Your home services, simplified in four easy steps

      </div>
      

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-2 sm:px-4 py-4 overflow-x-auto">
        {steps.map((item, index) => (
          <div key={index} className="flex flex-col sm:flex-row items-center w-full sm:w-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-green-500 text-white p-4 sm:p-6 lg:p-8 w-full sm:w-48 md:w-56 lg:w-64 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col items-center text-center hover:scale-[1.03] transition-all cursor-pointer"
            >
              <div className="bg-white text-green-600 font-bold px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm mb-3 sm:mb-4">
                {item.step}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{item.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed">{item.desc}</p>
            </motion.div>

            {/* Arrow between boxes except last */}
            {index < steps.length - 1 && (
              <div className="text-green-600 text-2xl sm:text-4xl font-bold my-2 sm:my-0 sm:ml-4 sm:mr-2 rotate-90 sm:rotate-0">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

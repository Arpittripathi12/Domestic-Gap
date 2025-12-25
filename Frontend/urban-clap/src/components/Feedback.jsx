import "./Feedback.css";
const Feedback = () => {
  const reviewsTop = [
    {
      img: "https://i.pravatar.cc/100?img=41",
      name: "Aanya Verma",
      location: "Indirapuram",
      text: "Loved how easy your website makes booking home services. The interface is clean, and the worker arrived exactly on time.",
    },
    {
      img: "https://i.pravatar.cc/100?img=12",
      name: "Rohan Mehta",
      location: "Powai, Mumbai",
      text: "The real-time booking confirmation and instant support chat were super impressive. The service quality was top-notch.",
    },
    {
      img: "https://i.pravatar.cc/100?img=25",
      name: "Meenal Kapoor",
      location: "Chandigarh",
      text: "Your platform is so smooth! I booked a cleaner in under a minute. Loved the professional behavior and transparent pricing.",
    },
    {
      img: "https://i.pravatar.cc/100?img=34",
      name: "Harshit Gupta",
      location: "Noida Sector 62",
      text: "Excellent experience. The technician knew exactly what to do and your reminder notifications are a great feature.",
    },
    {
      img: "https://i.pravatar.cc/100?img=18",
      name: "Shreya Bose",
      location: "Salt Lake, Kolkata",
      text: "Very reliable service! The worker was polite and efficient. I really appreciate the detailed tracking on the website.",
    },
    {
      img: "https://i.pravatar.cc/100?img=7",
      name: "Varun Sethi",
      location: "Pune Hinjewadi",
      text: "The whole process from booking to payment was super smooth. I’m impressed by the professionalism your platform maintains.",
    },
    {
      img: "https://i.pravatar.cc/100?img=19",
      name: "Keshav Iyer",
      location: "Coimbatore",
      text: "The website layout is simple yet powerful. Loved the fast service and clear instructions. Would definitely use again.",
    },
    {
      img: "https://i.pravatar.cc/100?img=29",
      name: "Zoya Khan",
      location: "Lucknow Gomti Nagar",
      text: "Your customer support is genuinely helpful! They solved my query instantly and my service request was fulfilled perfectly.",
    },
    {
      img: "https://i.pravatar.cc/100?img=38",
      name: "Pratham Singh",
      location: "Jaipur Vaishali Nagar",
      text: "Very professional service. I liked how the website shows verified workers and provides clear timing information.",
    },
    {
      img: "https://i.pravatar.cc/100?img=50",
      name: "Dia Fernandes",
      location: "Mangalore",
      text: "Super fast booking and excellent service delivery. It felt totally hassle-free. Highly recommended!",
    },
  ];

  const reviewsBottom = [
    {
      img: "https://i.pravatar.cc/100?img=2",
      name: "Kabir Arora",
      location: "Delhi Saket",
      text: "This is the most convenient home-service website I’ve used. Everything was seamless from start to finish.",
    },
    {
      img: "https://i.pravatar.cc/100?img=14",
      name: "Sonam Sharma",
      location: "Bhopal",
      text: "Great platform! The professionals were verified and polite. I appreciated the accurate ETA and timely updates.",
    },
    {
      img: "https://i.pravatar.cc/100?img=16",
      name: "Imran Qureshi",
      location: "Hyderabad Gachibowli",
      text: "The booking UI is super clean. Got a plumber within 20 minutes—excellent response time!",
    },
    {
      img: "https://i.pravatar.cc/100?img=23",
      name: "Anika Reddy",
      location: "Visakhapatnam",
      text: "Amazing service and punctual professionals. The website’s service categories are very well-organized.",
    },
    {
      img: "https://i.pravatar.cc/100?img=28",
      name: "Parthiv Desai",
      location: "Surat",
      text: "Affordable, fast and completely reliable. Loved the live tracking feature on your website.",
    },
    {
      img: "https://i.pravatar.cc/100?img=36",
      name: "Tina Dsouza",
      location: "Goa Panjim",
      text: "The technician was trained and polite. Your platform’s automated reminders really helped me plan my day.",
    },
    {
      img: "https://i.pravatar.cc/100?img=31",
      name: "Hriday Rajput",
      location: "Indore",
      text: "Very happy with the smooth payment system. The service quality exceeded my expectations.",
    },
    {
      img: "https://i.pravatar.cc/100?img=49",
      name: "Mahira Ansari",
      location: "Kanpur",
      text: "This website is so user-friendly! I booked a cleaning service for my parents and the entire process was flawless.",
    },
    {
      img: "https://i.pravatar.cc/100?img=20",
      name: "Aditya Dhamale",
      location: "Nagpur",
      text: "Great response time and very skilled workers. The booking process barely took 30 seconds!",
    },
    {
      img: "https://i.pravatar.cc/100?img=44",
      name: "Rituparna Bhatt",
      location: "Guwahati",
      text: "Loved the service quality and the professionalism. The dashboard where I can track all my bookings is super helpful.",
    },
  ];

  const finalreviewTop=[...reviewsTop,...reviewsTop]
  const finalreviewBottom=[...reviewsBottom,...reviewsBottom]

  return (
    <>
      <div className="w-full bg-white flex flex-col items-center px-4">
        <div className="w-full py-2 bg-white flex flex-col items-center" id="WhyUs">
          <div className="text-sm sm:text-lg lg:text-xl font-bold px-3 sm:px-4 py-2 text-center rounded-full bg-color-F4F7F9 border flex items-center gap-2 sm:gap-3">
            <img
              src="https://framerusercontent.com/images/rs39uhBOlBlpzeVhwp0IwDNDQ.svg?width=20&height=20"
              className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6"
            />

            <div>Our Testimonials</div>
          </div>
        </div>

        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold p-4 sm:p-6 lg:p-10 text-center">
          User reviews and feedback
        </div>
        <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-center px-4">
          See how Domestic-Gap has transformed users' experiences through<br className="hidden sm:block"/> their own words
        </div>

        <div className="flex flex-row items-center justify-center gap-6 w-full  px-4 py-4 overflow-x-auto"></div>

        <div className="reviews-wrapper">
         
          <div className="fade-left"></div>
          <div className="fade-right"></div>

          {/* TOP ROW → Left Moving */}
          <div className="scroll-row">
            <div className="scroll-content">
              {finalreviewTop.map((r, i) => (
                <div className="review-card" key={i}>
                  <div className="profile">
                    <div>

                        <img src={r.img} alt="" />
                        </div>
                    
                    <div>
                        
                            
                     <div className="font-bold text-xl">
                        {r.name}
                     </div>
                      <div>
                        {r.location}
                        </div>

                      
                    </div>
                  </div>
                  <p className="text">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
            <br/>
          {/* BOTTOM ROW → Right Moving */}
          <div className="scroll-row reverse">
            <div className="scroll-content">
              {finalreviewBottom.map((r, i) => (
                <div className="review-card" key={i}>
                  <div className="profile ">
                    <img src={r.img} alt="" />
                    <div>
                    <div className="font-bold text-xl">
                        {r.name}
                     </div>
                      <div>
                        {r.location}
                        </div>
                    </div>
                  </div>
                  <p className="text">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feedback;

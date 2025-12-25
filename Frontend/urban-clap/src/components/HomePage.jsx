import Header from "./Header";
import girl1 from "../assets/girl1.png";
import girl2 from "../assets/girl2.png";
import mobile from "../assets/mobile.avif";
import ServicesGrid from "./Services";
import InfiniteSlider from "./Slider";
import WorkingFlow from "./WorkingFlow";
import Feedback from "./Feedback";
import Footer from "./Footer";
import Search from "./Search";
import SearchServices from "./Search";

const HomePage = () => {
  
  return (
    <>
      {/* MAIN SECTION WITH GRADIENT + ROUNDED BOTTOM */}
     {/* MAIN SECTION WITH GRADIENT + ROUNDED BOTTOM */}
<div className="relative w-full bg-gradient-to-t from-green-500 to-white 
  rounded-b-[60px] rounded-bl-[40px] rounded-br-[40px] overflow-hidden
  min-h-[550px] sm:min-h-[650px] md:min-h-[750px] lg:min-h-[850px] xl:min-h-[920px]">

  <Header />

  {/* CONTENT FLEX ON DESKTOP, STACKED ON MOBILE */}
  <div className="
      relative w-full mx-auto mt-8 md:mt-12 
      flex flex-col lg:flex-row 
      justify-between items-center 
      overflow-visible px-4 pb-24 md:pb-32
    ">

    {/* LEFT GIRL IMAGE (HIDDEN ON MOBILE) */}
    <div className="hidden lg:block">
      <img
        src={girl1}
        alt="Girl"
        className="relative 
    -left-16 
    top-28    /* ↓ moved down */
    lg:top-32 /* ↓ even more down on large screens */
    z-10 
    
    max-w-xs xl:max-w-sm
  "
      />
    </div>
    
    {/* MAIN CENTER TEXT + SEARCH */}
    <div className="flex flex-col items-center text-center  max-w-3xl mx-auto px-4 mt-2 sm:mt-10 md:mt-16
">      
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
        India's 10 minute <br /> House Help Service Corner
      </div>

      <div className="text-base sm:text-lg md:text-xl px-2 mb-8 mt-2">
        We live in the parts of Gurugram, Noida, Bengaluru & ❤️
      </div> 

      {/* Search always stays above phone image */}
      <div className="mb-10">
        <SearchServices />
      </div>
    </div>

    {/* RIGHT GIRL IMAGE (HIDDEN ON MOBILE) */}
    <div className="hidden lg:block">
      <img
        src={girl2}
        alt="Girl"
        className="relative 
    -right-16 
    top-1
        /* ↓ moved down */
    lg:top-40 /* ↓ lowered on large screens */
    z-10 
    max-w-xs xl:max-w-md"
      />
    </div>

  </div>
</div>

{/* PHONE IMAGE SECTION — MOVES DOWN RESPONSIVELY */}
<div className="flex justify-center relative z-30 
  -mt-16 sm:-mt-20 md:-mt-32 lg:-mt-52 xl:-mt-64 px-4">

  <img
    src={mobile}
    alt="mobile"
    className="
  w-full
  max-w-xs
  sm:max-w-sm
  md:max-w-lg
  lg:max-w-2xl
  xl:max-w-3xl

  /* RESPONSIVE TOP MARGIN */
  -mt-10        /* mobile */
  sm:-mt-12     /* small screens */
  md:-mt-25     /* tablets */
  lg:-mt-15     /* laptops */
  xl:-mt-20     /* desktop large */

  drop-shadow
  transition-all
"

  />
</div>

      <ServicesGrid />
      
      <div className="text-center text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold px-4 leading-tight">
        On-demand professional workers
        <br className="hidden sm:block" />
        <span className="sm:hidden"> </span>available 24x7
      </div>

      <div className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font m-4 sm:m-6 md:m-8 px-4">
        No more planning around your help. <br />
        Our team of verified Domestic-Gap Professionals are always on time.
      </div>
      <InfiniteSlider />

      <WorkingFlow />
      <Feedback />
      <Footer />
    </>
  );
};

export default HomePage;

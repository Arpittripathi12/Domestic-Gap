import "./Slider.css"

  const items = [
    
    {
      title: "Bathroom Cleaning",
      img: "https://framerusercontent.com/images/2X9sc4YDnSn5aFwERpbbA0pSXg.png?width=1024&height=1024"
    },
    
    {
      title: "AC Repair",
      img: "https://islandcomfort.com/wp-content/uploads/2021/07/Untitled-design-24-1024x683.jpg"
    },
    {
      title: "Full Home Cleaning",
      img: "https://scrubnbubbles.com/wp-content/uploads/2022/05/cleaning-service.jpeg"
    },
    {
      title: "Dusting",
      img: "https://framerusercontent.com/images/wSS8VTSD0rNrPeSBNzbkEa3yyE.png?width=1024&height=1024"
    },
    {
      title: "Mopping",
      img: "https://framerusercontent.com/images/04AxhATKLbokeKOsbVLbvIxwHo0.png?width=1024&height=1024"
    },
    {
      title: "Chef Service",
      img: "https://media.istockphoto.com/id/951132442/photo/mastering-new-culinary-heights.jpg?s=612x612&w=0&k=20&c=96kg8oMcQ1VlItWhwRI69aAO_CWiZjHvNuvNYPiE59M="
    },
    {
      title: "Plumber Service",
      img: "https://media.istockphoto.com/id/183953925/photo/young-plumber-fixing-a-sink-in-bathroom.jpg?s=612x612&w=0&k=20&c=Ps2U_U4_Z60mIZsuem-BoaHLlCjsT8wYWiXNWR-TCDA="
    },
    {
      title: "Carpenter Work",
      img: "https://img.freepik.com/premium-photo/carpenter-working-with-drill-making-holes-plank_266732-45562.jpg?semt=ais_hybrid&w=740&q=80"
    },
    {
      title: "Sweeping",
      img:"https://framerusercontent.com/images/E3ZFvRtksQbNxTYTBYUcvrYK6k.png?width=1024&height=1024"
    },
    {
      title: "Painter Service",
      img: "https://media.istockphoto.com/id/1015387276/photo/man-in-a-working-overall.jpg?s=612x612&w=0&k=20&c=SiHLfl9X0lkncWAqyi8llAAG_dg4vk6mFn8JzaatQfk="
    },
    {
      title: "Washing Machine Repair",
      img: "https://media.istockphoto.com/id/2140183630/photo/repairman-using-a-screwdriver-disassembles-a-washing-machine-for-repair.jpg?s=612x612&w=0&k=20&c=vpLsKVsKm8LEUIBknDNzyrB8jQQHVL2Ib8oG72ymazM="
    }
  ];


export default function InfiniteSlider() {
  // duplicate items for seamless effect
  const finalList = [...items, ...items];

  return (
    <div className="slider-container">
        <div className="slider-track">
          {finalList.map((item, i) => (
            <div className="slider-card" key={i}>
              <img src={item.img} alt={item.title} />
              <div className="slider-title ">{item.title}</div>
            </div>
          ))}
        </div>
      </div> 
  );
}

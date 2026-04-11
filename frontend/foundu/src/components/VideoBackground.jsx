// import React from "react";
import videoBg from "../assets/286884.mp4";

const VideoBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover opacity-80" // Slightly translucent to blend with gradient
      >
        <source src={videoBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-10" />

    </div>
  );
};

export default VideoBackground;

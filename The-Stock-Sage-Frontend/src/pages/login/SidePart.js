import { Box, Image } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

export default function SidePart() {
  const images = [
    "/assets/images/sliderImage1.jpeg",
    "/assets/images/sliderImage2.jpeg",
    "/assets/images/sliderImage3.jpeg",
    "/assets/images/sliderImage4.jpeg",
  ];
  const delay = 2500;

  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
    // eslint-disable-next-line
  }, [index]);

  return (
    <Box align="center" justifyContent="center" height={"90%"} width={"90%"}>
      <Box className="slideshow">
        <Box
          className="slideshowSlider"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
        >
          {images.map((image, index) => {
            return (
              <Box className="slide" key={index}>
                <Image src={image} height={"350px"} width={"500px"} />
              </Box>
            );
          })}
        </Box>
        <Box className="slideshowDots">
          {images.map((_, idx) => {
            return (
              <Box
                key={idx}
                className={`slideshowDot${index === idx ? " active" : ""}`}
                onClick={() => {
                  setIndex(idx);
                }}
              ></Box>
            );
          })}
        </Box>
      </Box>
      <style>
        {`
          /* Slideshow */

          .slideshow {
            margin: 0 auto;
            overflow: hidden;
            max-width: 500px;
          }
          
          .slideshowSlider {
            white-space: nowrap;
            transition: ease 1000ms;
          }
          
          .slide {
            display: inline-block;
          
            height: 350px;
            width: 100%;
            border-radius: 40px;
          }
          
          /* Buttons */
          
          .slideshowDots {
            text-align: center;
          }
          
          .slideshowDot {
            display: inline-block;
            height: 10px;
            width: 10px;
            border-radius: 50%;
          
            cursor: pointer;
            margin: 15px 7px 0px;
          
            background-color: #c4c4c4;
          }
          
          .slideshowDot.active {
            background-color: #6a0dad;
          }
        `}
      </style>
    </Box>
  );
}

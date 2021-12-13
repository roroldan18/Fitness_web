import React, { useState } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';



export const CarouselNovedades = ({novedades}) => {

  const [activeIndex, setActiveIndex] = useState(0);

  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === novedades?.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? novedades?.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }

  


  
  return (
    <Carousel fade
      activeIndex={activeIndex}
      next={next}
      previous={previous}

    >
      <CarouselIndicators items={novedades} activeIndex={activeIndex} onClickHandler={goToIndex}/>
      {
          novedades?.map( (item) =>
          <CarouselItem
            onExiting={() => setAnimating(true)}
            onExited={() => setAnimating(false)}
            key={item.id}
          >
            <a href={item.path_destino}>
                <img 
                    src={item.path_imagen} 
                    alt={item.descripcion} 
                    className="d-block w-100"
                    />
            </a>
            <CarouselCaption captionText="" />
          </CarouselItem>
          )
      }
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  );
}

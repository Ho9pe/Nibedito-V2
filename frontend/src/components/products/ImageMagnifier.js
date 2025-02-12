'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function ImageMagnifier({ 
    src, 
    alt, 
    width, 
    height, 
    magnifierHeight = 175,
    magnifierWidth = 175,
    zoomLevel = 2.5 
}) {
    const [[x, y], setXY] = useState([0, 0]);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
    const [showMagnifier, setShowMagnifier] = useState(false);

    return (
        <div 
            className="image-magnifier-container"
        >
            <div className="image-wrapper">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="featured-image"
                    onMouseEnter={(e) => {
                        const elem = e.currentTarget;
                        const { width, height } = elem.getBoundingClientRect();
                        setSize([width, height]);
                        setShowMagnifier(true);
                    }}
                    onMouseLeave={() => setShowMagnifier(false)}
                    onMouseMove={(e) => {
                        const elem = e.currentTarget;
                        const { top, left } = elem.getBoundingClientRect();
                        const x = e.pageX - left - window.scrollX;
                        const y = e.pageY - top - window.scrollY;
                        setXY([x, y]);
                    }}
                />
            </div>

            {showMagnifier && (
                <div
                    className="magnifier-glass"
                    style={{
                        width: `${magnifierWidth}px`,
                        height: `${magnifierHeight}px`,
                        position: "absolute",
                        left: `${x - magnifierWidth / 2}px`,
                        top: `${y - magnifierHeight / 2}px`,
                        opacity: 1,
                        border: "2px solid var(--border-color)",
                        background: "white",
                        backgroundImage: `url('${src}')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: `${-x * zoomLevel + magnifierWidth / 2}px ${
                            -y * zoomLevel + magnifierHeight / 2
                        }px`,
                        backgroundSize: `${imgWidth * zoomLevel}px ${
                            imgHeight * zoomLevel
                        }px`,
                        pointerEvents: "none",
                    }}
                />
            )}
        </div>
    );
} 
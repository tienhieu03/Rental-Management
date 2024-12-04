import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
interface CarouselProps {
    children: React.ReactNode[];
    autoSlide?: boolean;
    autoSlideInterval?: number;
}

export default function Carousel({
    children: slides,
    autoSlide = false,
    autoSlideInterval = 3000,
}: CarouselProps) {
    const [curr, setCurr] = useState(0);
    const prev = () => {
        setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    };
    const next = () => {
        setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
    };
    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(next, autoSlideInterval);
        return () => clearInterval(slideInterval);
    }, []);
    return (
        <div className="overflow-hidden relative">
            <div
                className="flex h-80 object-cover  transition-transform ease-out duration-500"
                style={{ transform: `translateX(-${curr * 100}%)` }}
            >
                {slides}
            </div>
            <div className="absolute inset-0 flex items-center justify-between p-4">
                <button
                    onClick={prev}
                    className="p-1  rounded-full shadow bg-white/80 text-gray-500 hover:bg-white"
                >
                    <FaChevronLeft size={20} />
                </button>
                <button
                    onClick={next}
                    className="p-1 rounded-full shadow bg-white/80 text-gray-500 hover:bg-white"
                >
                    <FaChevronRight size={20} />
                </button>
            </div>
            <div className="absolute bottom-4 right-0 left-0">
                <div className="flex items-center justify-center gap-2">
                    {slides.map((_, i) => (
                        <div
                            className={`transition-all w-2 h-2 bg-white rounded-full ${
                                curr === i ? "p-1" : "bg-opacity-50"
                            }`}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

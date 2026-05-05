import { useCallback, useEffect, useRef, useState } from 'react';
import './NewsSlider.css';
import { useVKNews } from './useVKNews';

export const NewsSlider = () => {
    const { slides, loading, fromCache } = useVKNews();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0); 
    const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Состояние для полноэкранного режима ВСЕГО слайдера
    const [isFullScreenMode, setIsFullScreenMode] = useState(false);

    const baseSlideDuration = 15000;
    const IMAGE_CYCLE_TIME = 3000;
    const fadeDuration = 200; 

    const imagesCount = slides[currentIndex]?.imageUrls?.length || 0;
    const slideDuration = Math.max(baseSlideDuration, imagesCount * IMAGE_CYCLE_TIME);

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        const dateString = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        const timeString = date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${dateString} в ${timeString}`;
    };

    const isToday = (timestamp: number): boolean => {
        const date = new Date(timestamp * 1000);
        const today = new Date();
        const dayInMs = 24 * 60 * 60 * 1000;
        return (today.getTime() - date.getTime()) < dayInMs;
    };

    const goToSlide = useCallback((index: number) => {
        if (index === currentIndex) return;
        if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
        
        setVisible(false);
        fadeTimeoutRef.current = setTimeout(() => {
            setCurrentIndex(index);
            setCurrentImageIndex(0);
            setProgress(0);
            setVisible(true);
            fadeTimeoutRef.current = null;
        }, fadeDuration);
    }, [currentIndex, fadeDuration]);

    const goPrev = useCallback(() => goToSlide((currentIndex - 1 + slides.length) % slides.length), [currentIndex, slides.length, goToSlide]);
    const goNext = useCallback(() => goToSlide((currentIndex + 1) % slides.length), [currentIndex, slides.length, goToSlide]);
    const handleTogglePause = useCallback(() => setIsPaused(!isPaused), [isPaused]);

    const nextImage = useCallback(() => {
        const images = slides[currentIndex]?.imageUrls || [];
        if (images.length <= 1) return;
        setCurrentImageIndex(prev => {
            if (prev < images.length - 1) return prev + 1;
            return prev;
        });
    }, [currentIndex, slides]);

    const prevImage = useCallback(() => {
        const images = slides[currentIndex]?.imageUrls || [];
        if (images.length <= 1) return;
        setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }, [currentIndex, slides]);

    // Эффект для переключения изображений внутри слайда
    useEffect(() => {
        if (isPaused || !visible || imagesCount <= 1) return;
        const timer = setInterval(nextImage, IMAGE_CYCLE_TIME);
        return () => clearInterval(timer);
    }, [currentIndex, isPaused, visible, imagesCount, nextImage]);

    // Логика прогресс-бара
    useEffect(() => {
        if (isPaused || !visible || slides.length === 0) return;
        let lastTime = Date.now();
        let frame: number;
        const update = () => {
            const now = Date.now();
            const delta = now - lastTime;
            lastTime = now;
            setProgress(prev => {
                const next = prev + (delta / slideDuration);
                if (next >= 1) {
                    setTimeout(goNext, 0); 
                    return 0;
                }
                return next;
            });
            frame = requestAnimationFrame(update);
        };
        frame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frame);
    }, [currentIndex, isPaused, visible, slideDuration, slides.length, goNext]);

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const newProgress = x / rect.width;
        setProgress(newProgress);
    };

    // Сброс прокрутки при смене слайда
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = 0;
        }
    }, [currentIndex]);

    // Предзагрузка следующего изображения
    useEffect(() => {
        const currentSlide = slides[currentIndex];
        if (!currentSlide) return;
        const nextImgIndex = currentImageIndex + 1;
        const nextImageUrl = currentSlide.imageUrls[nextImgIndex];
        if (nextImageUrl) {
            const img = new Image();
            img.src = nextImageUrl;
        }
    }, [currentIndex, currentImageIndex, slides]);

    // Закрытие полноэкранного режима по Escape
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isFullScreenMode) {
                setIsFullScreenMode(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isFullScreenMode]);

    if (loading) return <div className="loading-screen">Загрузка новостей...</div>;
    if (!slides || slides.length === 0) return <div className="loading-screen">Нет доступных новостей.</div>;

    const currentSlide = slides[currentIndex];
    const currentImageUrl = currentSlide?.imageUrls?.[currentImageIndex];
    const displayText = currentSlide.text;

    // Функции управления полноэкранным режимом
    const enterFullScreen = () => setIsFullScreenMode(true);
    const exitFullScreen = () => setIsFullScreenMode(false);

    return (
    <>
        {/* Основной контейнер слайдера */}
        <div className={`slider-container ${isFullScreenMode ? 'full-screen-mode' : ''}`}>
            
            {/* Кнопка закрытия — только в полноэкранном режиме */}
            {isFullScreenMode && (
                <button 
                    className="fullscreen-close-btn" 
                    onClick={exitFullScreen}
                    aria-label="Закрыть полноэкранный режим"
                >
                    &times;
                </button>
            )}

            <div className={`slider-content ${visible ? 'fade-in' : 'fade-out'}`}>
                <div className="particles-container">
                    <div className="particle p1"></div>
                    <div className="particle p2"></div>
                    <div className="particle p3"></div>
                    <div className="particle p4"></div>
                </div>

                <div className="slider-text-section">
                    <div className="slider-header">
                        <h2 className="slider-title">Новости</h2>
                        <a
                            className="slider-source-badge"
                            href={currentSlide.source === 'ЛСПК'
                                ? 'https://vk.com/gapou_kk_lspk'
                                : 'https://vk.com/studsovetlspk'}
                            target="_blank"
                            rel="noreferrer"
                        >
                            {currentSlide.source}
                        </a>
                        {isToday(currentSlide.date) && (
                            <span className="new-badge">НОВОЕ</span>
                        )}
                        {fromCache && (
                            <p className="slider-cache-warning">
                                Нет связи — показаны сохранённые новости
                            </p>
                        )}
                        <p className="slider-date">{formatDate(currentSlide.date)}</p>
                    </div>

                    <div className="slider-scroll-area" ref={scrollAreaRef}>
                        <p className="slider-text">{displayText}</p>
                    </div>

                    {/* Прогресс-бар и навигация — ТОЛЬКО в обычном режиме */}
                    {isFullScreenMode && (
                        <div className="slider-footer">
                            <div 
                                className="progress-bar-container" 
                                onClick={handleProgressClick}
                            >
                                <div
                                    className="progress-bar-fill"
                                    style={{ 
                                        width: `${progress * 100}%`,
                                        transition: 'none'
                                    }}
                                />
                            </div>

                            <div className="slider-nav">
                                <button className="nav-arrow" onClick={goPrev} aria-label="Назад">{'←'}</button>
                                <button className="nav-arrow play-pause" onClick={handleTogglePause} aria-label={isPaused ? "Пуск" : "Пауза"}>
                                    {isPaused ? '\u25B6' : '\u23F8'}
                                </button>
                                <button className="nav-arrow" onClick={goNext} aria-label="Вперёд">{'→'}</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="slider-image-section">
                    {currentImageUrl && (
                         <div 
                            className="slider-image-blur-bg" 
                            style={{ backgroundImage: `url(${currentImageUrl})` }}
                        ></div>
                    )}
                    
                    {/* Изображение — кликабельно для входа в полноэкранный режим */}
                    {currentImageUrl ? (
                        <img 
                            src={currentImageUrl} 
                            alt="Новость" 
                            className="slider-image clickable"
                            loading="eager"
                            onClick={enterFullScreen} // <-- ВАЖНО: открывает полный экран
                            title="Нажмите для просмотра в полном размере"
                        />
                    ) : (
                        <div className="no-image-placeholder">Нет изображения</div>
                    )}

                    {/* Навигация по фото — ТОЛЬКО в обычном режиме */}
                    {isFullScreenMode && currentSlide.imageUrls.length > 1 && (
                        <div className="image-nav">
                            <button className="img-nav-btn" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
                            <span className="img-counter">{currentImageIndex + 1} / {currentSlide.imageUrls.length}</span>
                            <button className="img-nav-btn" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
 </>
)}
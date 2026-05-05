import { useState, useEffect } from 'react';
import fetchJsonp from 'fetch-jsonp';

const VK_DOMAINS = ['gapou_kk_lspk', 'studsovetlspk'];
const ACCESS_TOKEN = import.meta.env.VITE_VK_TOKEN as string;
const VK_API_VERSION = '5.131';
const STORAGE_KEY = 'vk_news_cache';
const MAX_POSTS = 200; // Ограничение для стабильности при работе 24/7

export interface SlideData {
    id: string;
    text: string;
    imageUrls: string[];
    date: number;
    source: string;
}

interface VKPhotoSize {
    url: string;
    width: number;
    height: number;
    type: string;
}

interface VKPhoto {
    sizes: VKPhotoSize[];
}

interface VKAttachment {
    type: string;
    photo?: VKPhoto;
}

interface VKPost {
    id: number;
    text: string;
    date: number;
    attachments?: VKAttachment[];
}

interface VKWallResponse {
    response?: {
        items: VKPost[];
    };
    error?: {
        error_code: number;
        error_msg: string;
    };
}

// Сохраняем новости в localStorage
const saveToCache = (slides: SlideData[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(slides));
    } catch (e) {
        console.warn('Не удалось сохранить кэш:', e);
    }
};

// Читаем новости из localStorage
const loadFromCache = (): SlideData[] => {
    try {
        const cached = localStorage.getItem(STORAGE_KEY);
        return cached ? JSON.parse(cached) : [];
    } catch (e) {
        console.warn('Не удалось прочитать кэш:', e);
        return [];
    }
};

// Удаляем дубликаты постов на основе сходства текста
const removeDuplicates = (posts: SlideData[]): SlideData[] => {
    const uniquePosts: SlideData[] = [];
    for (const post of posts) {
        const isDuplicate = uniquePosts.some(existingPost => {
            const normalize = (t: string) => t.replace(/[\W_]+/g, '').toLowerCase();
            const n1 = normalize(post.text);
            const n2 = normalize(existingPost.text);
            if (n1.length < 50 || n2.length < 50) {
                return n1 === n2;
            }
            return n1.substring(0, 50) === n2.substring(0, 50);
        });
        if (!isDuplicate) {
            uniquePosts.push(post);
        }
    }
    return uniquePosts;
};

export const useVKNews = () => {
    const [slides, setSlides] = useState<SlideData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [fromCache, setFromCache] = useState(false);

    useEffect(() => {
        const fetchAllNews = async (isBackground = false) => {
            try {
                if (isBackground) {
                    setIsRefreshing(true);
                } else {
                    setLoading(true);
                }

                const requests = VK_DOMAINS.map(domain => {
                    const url = `https://api.vk.com/method/wall.get?domain=${domain}&count=100&access_token=${ACCESS_TOKEN}&v=${VK_API_VERSION}`;
                    return fetchJsonp(url).then(res => res.json() as Promise<VKWallResponse>);
                });

                const results = await Promise.all(requests);
                let allPosts: SlideData[] = [];

                results.forEach((data: VKWallResponse, index: number) => {
                    if (data.error) {
                        console.error(
                            `VK API error для домена ${VK_DOMAINS[index]}:`,
                            data.error.error_msg
                        );
                        return;
                    }

                    if (data.response && data.response.items) {
                        const domain = VK_DOMAINS[index];
                        const sourceName = domain === 'gapou_kk_lspk' ? 'ЛСПК' : 'Студсовет';

                        const formattedPosts = data.response.items
                            .filter((post: VKPost) =>
                                post.text && post.text.trim().length > 0 &&
                                post.attachments && post.attachments.some((att: VKAttachment) => att.type === 'photo')
                            )
                            .map((post: VKPost): SlideData => {
                                const photoUrls = post.attachments!
                                    .filter((att: VKAttachment) => att.type === 'photo')
                                    .map((att: VKAttachment) => {
                                        const sizes = att.photo!.sizes;
                                        return sizes[sizes.length - 1].url;
                                    });

                                const cleanText = post.text;

                                return {
                                    id: `${domain}_${post.id}`,
                                    text: cleanText,
                                    imageUrls: photoUrls,
                                    date: post.date,
                                    source: sourceName
                                };
                            });

                        allPosts = [...allPosts, ...formattedPosts];
                    }
                });

                allPosts.sort((a, b) => b.date - a.date);
                allPosts = removeDuplicates(allPosts);

                if (allPosts.length > 0) {
                    if (isBackground) {
                        // При обновлении фона: объединяем с существующими, убирая дубли
                        setSlides((prevSlides) => {
                            const existingIds = new Set(prevSlides.map(s => s.id));
                            const newPosts = allPosts.filter(post => !existingIds.has(post.id));
                            let combined = [...prevSlides, ...newPosts].sort((a, b) => b.date - a.date);
                            combined = removeDuplicates(combined).slice(0, MAX_POSTS);
                            saveToCache(combined);
                            return combined;
                        });
                    } else {
                        // При инициальной загрузке
                        const limitedPosts = allPosts.slice(0, MAX_POSTS);
                        saveToCache(limitedPosts);
                        setSlides(limitedPosts);
                    }
                    setFromCache(false);
                }

            } catch (error) {
                console.error('Ошибка при загрузке ВК:', error);

                // ВК недоступен — показываем кэш
                const cached = loadFromCache();
                if (cached.length > 0) {
                    console.warn('ВК недоступен, показываем кэшированные новости');
                    setSlides(cached);
                    setFromCache(true);
                }
            } finally {
                setLoading(false);
                setIsRefreshing(false);
            }
        };

        fetchAllNews(false);
        // Обновляем каждые 10 минут, чтобы новые посты появлялись часто
        const interval = setInterval(() => fetchAllNews(true), 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { slides, loading, isRefreshing, fromCache };
};
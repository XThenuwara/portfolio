'use client'

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import GitHubCalendar from 'react-github-calendar';
import { Icon } from '@iconify/react';
import profile from '@/data/data.json';
import LoadingSpinner from '@/components/LoadingSpinner';

const GithubContributionGraph = () => {
    const { theme } = useTheme();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const CACHE_KEY = `github-stats-${profile.blog.owner}`;
        const CACHE_TTL = 60 * 60 * 1000; // 1 hour

        const fetchData = async () => {
            try {
                // Check cache
                const cached = localStorage.getItem(CACHE_KEY);
                if (cached) {
                    const { data: cachedData, timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < CACHE_TTL) {
                        setData(cachedData);
                        setLoading(false);
                        return;
                    }
                }

                const response = await fetch(`https://api.github.com/users/${profile.blog.owner}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch stats');
                }
                const jsonData = await response.json();
                setData(jsonData);
                
                // Update cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data: jsonData,
                    timestamp: Date.now()
                }));
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const StatItem = ({ icon, label, value }: { icon: string, label: string, value: string | number }) => (
        <div className="flex items-center gap-2 bg-white/5 dark:bg-white/5 p-1.5 px-2.5 rounded-lg backdrop-blur-sm border border-white/10">
            <Icon icon={icon} width="16" height="16" className="text-gray-400" />
            <div>
                <div className="hidden md:block text-[8px] uppercase tracking-wider text-gray-500 font-bold leading-none mb-0.5">{label}</div>
                <div className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-none">{value}</div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full justify-between gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-2">
                <div className="flex items-center gap-2">
                    <Icon icon="mingcute:github-fill" width="24" height="24" className="text-gray-900 dark:text-gray-100" />
                    <h2 className="text-lg font-bold tracking-tight">Contributions</h2>
                </div>
                {!loading && data && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 md:mr-[-10px]">
                        <StatItem icon="ph:git-fork-bold" label="Repos" value={data.public_repos} />
                        <StatItem icon="ph:users-bold" label="Followers" value={data.followers} />
                        <StatItem icon="ph:user-circle-plus-bold" label="Following" value={data.following} />
                        <StatItem icon="ph:calendar-bold" label="Since" value={new Date(data.created_at).getFullYear()} />
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center overflow-hidden">
                <div className="w-full transform scale-[0.95] md:scale-100 translate-x-[-2%] md:translate-x-0">
                    <GitHubCalendar 
                        username={profile.blog.owner} 
                        year="last" 
                        colorScheme={theme === "light" ? "light" : "dark"}
                        fontSize={12}
                        blockSize={12}
                        blockMargin={4}
                    />
                </div>
            </div>
        </div>
    );
};

export default GithubContributionGraph;

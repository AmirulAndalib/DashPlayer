import React, { useEffect, useState } from "react";
import { GoHistory } from 'react-icons/go';
import { IoRefreshCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import useSystem from '../hooks/useSystem';
import TitleBar from './TitleBar/TitleBar';
import { secondToDate } from './PlayTime';
import useSetting from '../hooks/useSetting';
import { cn } from '../../utils/Util';
import OpenFile from './OpenFile';
import useProjectBrowser from '../hooks/useProjectBrowser';
import { WatchProjectVO } from '../../db/service/WatchProjectService';
import WatchProjectItem from './WatchProjectItem';
import logoLight from '../../../assets/logo-light.png';
import logoDark from '../../../assets/logo-dark.png';
import useLayout from "../hooks/useLayout";

const api = window.electron;
const HomePage = () => {
    const {
        recentPlaylists,
        refresh,
        loading: isLoading,
    } = useProjectBrowser();
    const changeSideBar = useLayout((s) => s.changeSideBar);
    const appVersion = useSystem((s) => s.appVersion);
    const dark = useSetting((s) => s.appearance.theme) === 'dark';
    const navigate = useNavigate();
    const handleClick = (item: WatchProjectVO) => {
        const video = item.videos.filter((v) => {
            return v.current_playing === 1;
        })[0];
        console.log('click', item);
        if (!video) {
            return;
        }
        api.playerSize();
        changeSideBar(false);
        navigate(`/player/${video.id}`);
    };
    useEffect(() => {
        api.homeSize();
    }, []);
    const lastPlay =
        recentPlaylists.length > 0 ? recentPlaylists[0] : undefined;
    const lastPlayVideo = lastPlay?.videos.filter((v) => {
        return v.current_playing === 1;
    })[0];
    const restPlay = recentPlaylists.length > 1 ? recentPlaylists.slice(1) : [];
    console.log('lastplay', lastPlayVideo, lastPlay, restPlay);
    return (
        <div
            className={cn(
                'w-full h-screen flex-1 flex justify-center items-center select-none overflow-hidden text-black/80',
                'bg-slate-200',
                'dark:bg-neutral-800 dark:text-white/80'
            )}
        >
            <TitleBar
                maximizable={false}
                className="fixed top-0 left-0 w-full z-50"
                windowsButtonClassName={cn(
                    'text-slate-700 hover:bg-slate-100',
                    'dark:hover:bg-titlebarHover'
                )}
                autoHideOnMac={false}
            />
            <div
                className={cn(
                    'w-1/3 h-full backdrop-blur flex flex-col justify-center items-center bg-white/20 rounded-l-lg gap-14 drop-shadow shadow-white',
                    'dark:shadow-black'
                )}
            >
                <div className="relative top-0 left-0 w-32 h-32">
                    <img
                        src={dark ? logoDark : logoLight}
                        alt="logo"
                        className="w-32 h-32 absolute top-0 left-0 user-drag-none"
                    />
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                    <h2
                        className={cn(
                            'text-lg text-black/80',
                            dark && 'text-white/80'
                        )}
                    >
                        DashPlayer
                    </h2>
                    <text
                        className={cn('text-black/75', dark && 'text-white/75')}
                    >
                        {appVersion}
                    </text>
                </div>
                <div className="w-full h-16" />
            </div>
            <div
                className={cn(
                    'h-full flex-1 backdrop-blur w-0 flex flex-col justify-center items-center bg-stone-200 rounded-r-lg border-l border-stone-400 pl-8 pr-10 gap-6',
                    dark && 'border-neutral-800 bg-white/10'
                )}
            >
                <div className="w-full h-10" />
                <div className={cn('flex w-full flex-col items-start')}>
                    <OpenFile className={cn('text-sm')} />
                    <OpenFile className={cn('text-sm')} directory />
                </div>
                {lastPlay && (
                    <div
                        onClick={() => handleClick(lastPlay)}
                        className={cn(
                            'w-full bg-black/10 hover:bg-black/20 px-4 h-12 rounded-lg flex items-center justify-start gap-2 text-sm',
                            dark && 'bg-white/10 hover:bg-white/20'
                        )}
                    >
                        <GoHistory
                            className={cn(
                                'w-4 h-4 fill-neutral-600',
                                dark && 'fill-neutral-400'
                            )}
                        />
                        <span>Resume</span>
                        <span className="flex-1 truncate">
                            {`${lastPlay?.project_name ?? ''} / ${
                                lastPlayVideo?.video_name ?? ''
                            }`}
                        </span>
                        <span
                            className={cn(
                                'text-neutral-600',
                                dark && 'text-neutral-400'
                            )}
                        >
                            {secondToDate(lastPlayVideo?.current_time ?? 0)}
                        </span>
                    </div>
                )}
                <div className="w-full flex-1 flex flex-col overflow-y-auto scrollbar-none text-sm">
                    {restPlay.map((playlist) => {
                        return <WatchProjectItem item={playlist} />;
                    })}
                </div>
                <div className="w-full h-16">
                    <div
                        onClick={() => {
                            if (!isLoading) {
                                refresh();
                            }
                        }}
                        className={cn(
                            'ml-auto w-8 h-8 rounded hover:bg-stone-300 p-1'
                        )}
                    >
                        <IoRefreshCircleOutline
                            className={cn(
                                'w-full h-full',
                                isLoading && 'animate-spin'
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;

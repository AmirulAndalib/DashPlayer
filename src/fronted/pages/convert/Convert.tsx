import { cn } from '@/fronted/lib/utils';
import Separator from '@/fronted/components/Separtor';
import React from 'react';
import ConvertFileSelector from '@/fronted/pages/convert/ConvertFileSelector';
import ConvertFolderSelector from '@/fronted/pages/convert/FolderSelector';
import ConvertItem from '@/fronted/pages/convert/convert-item';
import useConvert from '@/fronted/hooks/useConvert';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/fronted/components/ui/button';
import { DpTaskState } from '@/backend/db/tables/dpTask';
import Eb from '@/fronted/components/Eb';


const api = window.electron;
const Convert = () => {
    const {
        files,
        folders,
        addFiles,
        addFolders,
        taskStats,
        convertFolder,
        deleteFolder,
        deleteFile
    } = useConvert(useShallow(s => ({
        files: s.files,
        folders: s.folders,
        addFiles: s.addFiles,
        addFolders: s.addFolders,
        deleteFolder: s.deleteFolder,
        deleteFile: s.deleteFile,
        taskStats: s.taskStats,
        convertFolder: s.convertFolder
    })));

    return (
        <div
            className={cn(
                'w-full h-full flex flex-col overflow-hidden select-none bg-background p-6 pt-12 text-foreground'
            )}
        >
            <div className={cn('p-4')}>
                <h1 className={cn('text-4xl font-bold font-serif')}>
                    Convert mkv to mp4
                </h1>
                <h2 className={cn('text-xl text-secondary-foreground mt-2 mb-4')}>
                    Convert mkv to mp4 with subtitles
                </h2>
                <Separator orientation="horizontal" className="px-0" />
            </div>
            <div className={cn('flex flex-col w-full h-0 flex-1 px-10 pr-16')}>
                <div
                    className={cn('justify-self-end flex mb-10 flex-wrap w-full justify-center items-center gap-2 min-h-20 rounded border border-dashed p-2')}
                >
                    <ConvertFileSelector
                        onSelected={async (ps) => {
                            addFiles(ps);
                        }}
                    />
                    <ConvertFolderSelector
                        onSelected={async (fp) => {
                            const folderList = await api.call('convert/from-folder', fp);
                            addFolders(folderList);
                        }}
                    />
                </div>
                <div className={cn('flex flex-col gap-4 h-0 flex-1 overflow-y-auto scrollbar-none p-2')}>

                    {folders.map((folder) => {
                        const hasP = (folder.videos ?? []).some(v => taskStats.get(v) === DpTaskState.IN_PROGRESS);
                        const allP = (folder.videos ?? []).every(v => taskStats.get(v) === DpTaskState.IN_PROGRESS);
                        return (
                            <Eb key={folder.folder}>
                                <div className={cn('flex flex-col gap-4 border p-4 rounded-lg bg-muted')}>
                                    <div className={cn('flex gap-2')}>
                                        <h2 className={cn('text-xl font-semibold')}>
                                            {folder?.folder}
                                        </h2>
                                        <Button variant={'outline'} size={'sm'} className={cn('ml-auto')}
                                                onClick={() => {
                                                    deleteFolder(folder.folder);
                                                }}>
                                            {hasP ? 'Cancel' : 'Delete'}
                                        </Button>
                                        <Button
                                            disabled={allP}
                                            size={'sm'} className={cn('')} onClick={() => {
                                            convertFolder(folder.folder);
                                        }}>
                                            Convert
                                        </Button>
                                    </div>

                                    <div className={cn('grid grid-cols-2 gap-2')}>
                                        {folder.videos.map((file) => {
                                            return <Eb
                                                key={file}
                                            ><ConvertItem
                                                buttonVariant={'small'}
                                                className={'bg-background drop-shadow'} file={file}
                                                onSelected={() => {
                                                    console.log('selected', file);
                                                }}
                                                onDeleted={() => {
                                                    deleteFolder(folder.folder, file);
                                                }}
                                            />
                                            </Eb>;
                                        })}
                                    </div>
                                </div>
                            </Eb>
                        );
                    })}
                    {files.map((file) => {
                        return <Eb key={file}>
                            <ConvertItem
                                className={'border'} file={file}
                                onSelected={() => {
                                    console.log('selected', file);
                                }}
                                onDeleted={() => {
                                    deleteFile(file);
                                }}
                            />
                        </Eb>;
                    })}
                </div>
            </div>
        </div>
    );
};
export default Convert;

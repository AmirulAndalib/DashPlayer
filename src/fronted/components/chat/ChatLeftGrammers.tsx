import { cn } from '@/fronted/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/fronted/components/ui/card';
import useChatPanel from '@/fronted/hooks/useChatPanel';
import React from 'react';
import Md from '@/fronted/components/chat/markdown';
import { Button } from '@/fronted/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { Skeleton } from '@/fronted/components/ui/skeleton';
import useDpTaskViewer2 from '@/fronted/hooks/useDpTaskViewer2';
import { AiAnalyseGrammarsRes } from '@/common/types/aiRes/AiAnalyseGrammarsRes';

const ChatLeftGrammers = ({ className }: {
    className: string,
}) => {
    const retry = useChatPanel(state => state.retry);
    const tid = useChatPanel(state => state.tasks.grammarTask);
    const {detail} = useDpTaskViewer2<AiAnalyseGrammarsRes>(typeof tid === 'number' ? tid : null);
    console.log('detail', detail);
    return (
        <div className={cn('flex flex-col', className)}>
            <Card className={'shadow-none relative'}>
                <CardHeader>
                    <CardTitle>本句语法</CardTitle>
                    <Button variant={'ghost'} size={'icon'} onClick={() => retry('grammar')}
                            className={'absolute right-2 top-2 w-8 h-8 text-gray-400 dark:text-gray-200'}>
                        <RefreshCcw className={'w-3 h-3'} />
                    </Button>
                    {/*<CardDescription>Manage player settings and behavior</CardDescription>*/}
                </CardHeader>
                <CardContent>
                    {!detail && <><Skeleton className={'h-6'} /><Skeleton className={'h-6 mt-2'} /><Skeleton
                        className={'h-6 mt-2'} /></>}
                    {detail?.hasGrammar}
                    {detail?.hasGrammar && (
                        <Md>
                            {detail?.grammarsMd}
                        </Md>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ChatLeftGrammers;

"use client"

import React, { ReactNode, useState } from 'react';
import { Message, MessageReaction } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { UserIcon, ServerIcon, MonitorIcon, SmileIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@clerk/nextjs';

interface MessageCardProps {
  message: Message;
  index?: number; // Ajout d'un index optionnel pour alterner les messages
}

// Liste des émoticons disponibles
const availableEmojis = ['👍', '❤️', '😂', '😮', '😢', '👏', '🎉', '🙏'];

export function MessageCard({ message, index = 0 }: MessageCardProps) {
  const { userId } = useAuth();
  const [reactions, setReactions] = useState<MessageReaction[]>(message.reactions || []);
  
  // Fonction pour ajouter une réaction
  const addReaction = async (emoji: string) => {
    try {
      const response = await fetch('/api/messages/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: message.id,
          emoji,
        }),
      });

      if (response.ok) {
        const newReaction = await response.json();
        setReactions(prev => [...prev.filter(r => r.id !== newReaction.id), newReaction]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réaction:', error);
    }
  };

  // Fonction pour supprimer une réaction
  const removeReaction = async (reactionId: string) => {
    try {
      const response = await fetch(`/api/messages/reactions/${reactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReactions(reactions.filter(reaction => reaction.id !== reactionId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la réaction:', error);
    }
  };

  // Grouper les réactions par emoji
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, MessageReaction[]>);

  const senderTypeMap: Record<string, string> = {
    'client': 'Client',
    'admin': 'Support',
    'system': 'Système'
  };

  const senderIconMap: Record<string, React.ReactNode> = {
    'client': <UserIcon className="h-4 w-4 text-blue-500" />,
    'admin': <ServerIcon className="h-4 w-4 text-green-500" />,
    'system': <MonitorIcon className="h-4 w-4 text-amber-500" />
  };

  // Fonction pour détecter si le message contient du code
  const containsCodeBlock = (content: string): boolean => {
    return content.includes('```');
  };

  // Déterminer si le message est du client ou du support pour le style
  const isSystemMessage = message.senderType === 'system';
  
  // Forcer l'alternance des messages
  const isEven = index % 2 === 0;
  const isCurrentUser = isEven;

  return (
    <div className={`flex w-full ${isSystemMessage ? 'justify-center' : isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isSystemMessage && (
        <div className={`max-w-[80%] ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}>
          <div className="flex items-center mb-1">
            <div className={`flex items-center gap-1 text-xs ${isCurrentUser ? 'ml-auto' : ''}`}>
              {!isCurrentUser && senderIconMap[message.senderType]}
              <span className="font-medium">
                {isCurrentUser ? 'Vous' : senderTypeMap[message.senderType]}
              </span>
              {isCurrentUser && senderIconMap[message.senderType]}
            </div>
          </div>
          
          <Card className={`rounded-2xl p-3 ${
            isCurrentUser 
              ? 'bg-primary/10 border-primary/20 rounded-tr-sm' 
              : 'bg-muted/50 border-muted rounded-tl-sm'
          }`}>
            <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={`${className} px-1 py-0.5 rounded bg-muted font-mono text-sm`} {...props}> 
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }: any) => {
                    return <p className="mb-2 last:mb-0">{children}</p>;
                  },
                  ul: ({ children }: any) => {
                    return <ul className="list-disc pl-6 mb-2">{children}</ul>;
                  },
                  ol: ({ children }: any) => {
                    return <ol className="list-decimal pl-6 mb-2">{children}</ol>;
                  },
                  li: ({ children }: any) => {
                    return <li className="mb-1">{children}</li>;
                  },
                  blockquote: ({ children }: any) => {
                    return <blockquote className="border-l-4 border-primary/30 pl-3 italic">{children}</blockquote>;
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Affichage des réactions */}
            {Object.keys(groupedReactions).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(groupedReactions).map(([emoji, reactions]) => (
                  <TooltipProvider key={emoji}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 rounded-full bg-muted/50 hover:bg-muted"
                          onClick={() => {
                            // Si l'utilisateur a déjà réagi avec cet emoji, supprimer sa réaction
                            const userReaction = reactions.find(r => r.userId === userId);
                            if (userReaction) {
                              removeReaction(userReaction.id);
                            }
                          }}
                        >
                          <span className="mr-1 text-lg">{emoji}</span>
                          <span className="text-xs">{reactions.length}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {reactions.map(reaction => reaction.userName || 'Utilisateur').join(', ')}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                {!message.read && (
                  <div className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    <span className="ml-1 text-xs text-primary">Non lu</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">{formatDateTime(message.createdAt)}</span>
              </div>

              {/* Bouton pour ajouter une réaction */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full ml-auto">
                    <SmileIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3" align="end">
                  <div className="flex gap-2 flex-wrap max-w-[240px]">
                    {availableEmojis.map(emoji => (
                      <Button
                        key={emoji}
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 text-xl"
                        onClick={() => addReaction(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </Card>
        </div>
      )}

      {/* Message système (centré) */}
      {isSystemMessage && (
        <Card className="max-w-[90%] bg-amber-500/5 border-amber-500/20 rounded-md p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {senderIconMap[message.senderType]}
            <span className="text-xs font-medium">{senderTypeMap[message.senderType]}</span>
          </div>
          <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{formatDateTime(message.createdAt)}</div>
        </Card>
      )}
    </div>
  );
} 
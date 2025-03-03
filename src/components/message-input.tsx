"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { SendIcon, EyeIcon, EditIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
}

export function MessageInput({
  value,
  onChange,
  onSend,
  placeholder = "Écrivez votre message...",
  disabled = false
}: MessageInputProps) {
  const [activeTab, setActiveTab] = useState<string>('edit')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      onSend()
    }
  }

  const markdownGuide = `
### Formatage de base
**Gras** ou __Gras__
*Italique* ou _Italique_
~~Barré~~

### Listes
- Item 1
- Item 2
  - Sous-item

1. Premier
2. Deuxième

### Liens et images
[Texte du lien](https://example.com)

### Code
\`Code en ligne\`

\`\`\`javascript
// Bloc de code
function hello() {
  console.log("Hello world!");
}
\`\`\`

### Citations
> Ceci est une citation

### Tableaux
| Colonne 1 | Colonne 2 |
|-----------|-----------|
| Cellule 1 | Cellule 2 |
  `

  return (
    <div className="space-y-2">
      <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <EditIcon className="h-3.5 w-3.5" />
              <span>Éditer</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <EyeIcon className="h-3.5 w-3.5" />
              <span>Aperçu</span>
            </TabsTrigger>
          </TabsList>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => {
              const helpText = "Ctrl+Enter pour envoyer\n\n" + markdownGuide
              alert(helpText)
            }}
          >
            Guide Markdown
          </Button>
        </div>
        
        <TabsContent value="edit" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[120px] font-mono text-sm"
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0 border rounded-md p-3 min-h-[120px] bg-muted/30">
          {value ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        // @ts-ignore
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Rien à prévisualiser
            </p>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button 
          onClick={onSend} 
          disabled={disabled || !value.trim()} 
          className="flex items-center gap-1"
        >
          <SendIcon className="h-4 w-4" />
          <span>Envoyer</span>
          <span className="ml-1 text-xs opacity-70">(Ctrl+Enter)</span>
        </Button>
      </div>
    </div>
  )
} 
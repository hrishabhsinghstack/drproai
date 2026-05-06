'use client'
import React, { useEffect, useRef } from 'react'

interface Props {
  text: string
  isStreaming?: boolean
}

export function StreamingText({ text, isStreaming }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (isStreaming && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [text, isStreaming])

  // Convert markdown-like text to JSX
  const renderText = (raw: string) => {
    const lines = raw.split('\n')
    const blocks: React.ReactNode[] = []
    let currentTable: string[][] = []

    const processInline = (line: string) => {
      return line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-semibold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>
        }
        return <span key={j}>{part}</span>
      })
    }

    const flushTable = (key: number) => {
      if (currentTable.length > 0) {
        const header = currentTable[0]
        const data = currentTable.length > 2 && currentTable[1][0].includes('-') ? currentTable.slice(2) : currentTable.slice(1)
        
        blocks.push(
          <div key={`table-${key}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/50 w-full max-w-full">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  {header.map((th, idx) => (
                    <th key={idx} className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {processInline(th.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    {row.map((td, colIdx) => (
                      <td key={colIdx} className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        {processInline(td.trim())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        currentTable = []
      }
    }

    lines.forEach((line, i) => {
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const row = line.trim().split('|').slice(1, -1)
        currentTable.push(row)
        return
      } else {
        flushTable(i)
      }

      const parts = processInline(line)

      if (line.startsWith('### ')) {
        blocks.push(<h3 key={i} className="font-semibold text-sm mt-3 mb-1 text-foreground">{processInline(line.slice(4))}</h3>)
        return
      }
      if (line.startsWith('## ')) {
        blocks.push(<h2 key={i} className="font-bold text-base mt-4 mb-1 text-foreground">{processInline(line.slice(3))}</h2>)
        return
      }
      if (line.startsWith('# ')) {
        blocks.push(<h1 key={i} className="font-bold text-lg mt-4 mb-2 text-foreground">{processInline(line.slice(2))}</h1>)
        return
      }

      if (line.startsWith('- ') || line.startsWith('• ')) {
        blocks.push(
          <div key={i} className="flex gap-2 my-0.5 ml-1">
            <span className="text-[#00a99d] mt-0.5 shrink-0">•</span>
            <span>{processInline(line.slice(2))}</span>
          </div>
        )
        return
      }

      const numberedMatch = line.match(/^(\d+)\.\s(.+)/)
      if (numberedMatch) {
        blocks.push(
          <div key={i} className="flex gap-2 my-0.5 ml-1">
            <span className="text-[#00a99d] font-medium shrink-0">{numberedMatch[1]}.</span>
            <span>{processInline(numberedMatch[2])}</span>
          </div>
        )
        return
      }

      if (!line.trim()) {
        blocks.push(<div key={i} className="h-2" />)
        return
      }

      blocks.push(<p key={i} className="my-0.5 leading-relaxed">{parts}</p>)
    })

    flushTable(lines.length)
    return blocks
  }

  return (
    <div ref={ref} className="text-sm leading-relaxed">
      {renderText(text)}
      {isStreaming && (
        <span className="inline-block w-2 h-4 bg-primary/60 ml-0.5 rounded-sm animate-pulse align-text-bottom" />
      )}
    </div>
  )
}

import { useState, useRef, useCallback, useEffect } from 'react'
import Editor, { loader } from '@monaco-editor/react'

// Configurar tema cyber-dark para Monaco (solo una vez)
function useMonacoTheme() {
  useEffect(() => {
    loader.init().then((monaco) => {
      // Evitar redefinir si ya existe
      if (monaco.editor.getTheme('cyber-dark')) return
      monaco.editor.defineTheme('cyber-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'comment', foreground: '6a9955', fontStyle: 'italic' },
          { token: 'keyword', foreground: '9d00ff' },
          { token: 'string', foreground: '00ff66' },
          { token: 'number', foreground: '00e5ff' },
          { token: 'tag', foreground: 'ff007f' },
          { token: 'attribute.name', foreground: '00e5ff' },
          { token: 'attribute.value', foreground: '00ff66' },
          { token: 'delimiter', foreground: 'e0e0e0' },
        ],
        colors: {
          'editor.background': '#0a0a0f',
          'editor.foreground': '#e0e0e0',
          'editor.lineHighlightBackground': '#12131c',
          'editor.selectionBackground': '#1f2438',
          'editorCursor.foreground': '#00e5ff',
          'editorLineNumber.foreground': '#1f2438',
          'editorLineNumber.activeForeground': '#00e5ff',
          'editor.selectionHighlightBackground': '#1f243880',
          'editorBracketMatch.background': '#1f2438',
          'editorBracketMatch.border': '#00e5ff',
          'scrollbarSlider.background': '#1f2438',
          'scrollbarSlider.hoverBackground': '#00e5ff40',
          'scrollbarSlider.activeBackground': '#00e5ff60',
        },
      })
    })
  }, [])
}

const TABS = [
  { id: 'html', label: 'index.html', language: 'html', icon: '🌐' },
  { id: 'css', label: 'styles.css', language: 'css', icon: '🎨' },
  { id: 'js', label: 'script.js', language: 'javascript', icon: '⚡' },
]

export default function CodeEditor({ files, onCodeChange, readOnly = false }) {
  useMonacoTheme()
  const editorRef = useRef(null)
  const activeTabRef = useRef('html')
  const [activeTab, setActiveTab] = useState('html')

  const handleEditorDidMount = useCallback((editor) => {
    editorRef.current = editor
  }, [])

  const handleChange = useCallback(
    (value) => {
      if (onCodeChange) {
        onCodeChange(activeTabRef.current, value || '')
      }
    },
    [onCodeChange]
  )

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId)
    activeTabRef.current = tabId
  }, [])

  const currentFile = files[activeTab] || ''

  return (
    <div className="flex flex-col h-full border border-cyber-border rounded-lg overflow-hidden bg-cyber-dark">
      {/* Pestañas */}
      <div className="flex border-b border-cyber-border bg-cyber-card">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
              className={`
              flex items-center gap-1.5 px-4 py-2.5 font-mono text-xs border-r border-cyber-border
              transition-all duration-150
              ${
                activeTab === tab.id
                  ? 'bg-cyber-dark text-cyber-cyan border-b-2 border-b-cyber-cyan shadow-[0_0_8px_rgba(0,229,255,0.2)]'
                  : 'text-cyber-text/60 hover:text-cyber-text hover:bg-cyber-dark/50'
              }
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          key={activeTab}
          height="100%"
          language={TABS.find((t) => t.id === activeTab)?.language || 'html'}
          value={currentFile}
          theme="cyber-dark"
          onChange={handleChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            automaticLayout: true,
            padding: { top: 12 },
            bracketPairColorization: { enabled: true },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            folding: true,
            foldingHighlight: true,
            guides: { indentation: true, bracketPairs: true },
          }}
        />
      </div>
    </div>
  )
}
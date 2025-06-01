import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Wifi, RadioTower, Waves, User, User2, CheckCheck } from "lucide-react"

const NODES = [
  { id: "A", label: "Device A (WiFi)", icon: <Wifi className="h-6 w-6" /> },
  { id: "G", label: "Ground Node (LoRa)", icon: <RadioTower className="h-6 w-6" /> },
  { id: "M", label: "Marine Node (LoRa)", icon: <Waves className="h-6 w-6" /> },
  { id: "B", label: "Device B (WiFi)", icon: <Wifi className="h-6 w-6" /> },
]

export function LoraMeshSimulator() {
  const [messageA, setMessageA] = useState("")
  const [messageB, setMessageB] = useState("")
  const [chat, setChat] = useState<{ 
    from: string; 
    text: string; 
    timestamp: Date;
    delivered: boolean;
    direction: 'ltr' | 'rtl';
  }[]>([])
  const [progress, setProgress] = useState(0)
  const [simulating, setSimulating] = useState(false)
  const [delay, setDelay] = useState(1000)
  const [currentNode, setCurrentNode] = useState<string | null>(null)
  const [totalHops, setTotalHops] = useState(0)
  const [progressDirection, setProgressDirection] = useState<'ltr' | 'rtl'>('ltr')

  const getPath = (from: string) => {
    return from === "A" 
      ? ["A", "G", "M", "B"]  // A → Ground → Marine → B
      : ["B", "M", "G", "A"]  // B → Marine → Ground → A
  }

  const simulateTransfer = async (text: string, from: string) => {
    setSimulating(true)
    const path = getPath(from)
    setTotalHops(path.length)
    setProgressDirection(from === "A" ? 'ltr' : 'rtl')
    
    const newMessage: {
      from: string;
      text: string;
      timestamp: Date;
      delivered: boolean;
      direction: 'ltr' | 'rtl';
    } = {
      from,
      text,
      timestamp: new Date(),
      delivered: false,
      direction: from === "A" ? 'ltr' : 'rtl'
    }
    setChat(c => [...c, newMessage])
    
    for (let i = 0; i < path.length; i++) {
      setCurrentNode(path[i])
      setProgress(((i + 1) / path.length) * 100)
      await new Promise(res => setTimeout(res, delay))
    }
    
    setChat(c => c.map(msg => 
      msg === newMessage ? { ...msg, delivered: true } : msg
    ))
    
    setSimulating(false)
    setProgress(0)
    setCurrentNode(null)
    setTotalHops(0)
  }

  return (
    <Card className="p-6 space-y-6 bg-background border border-border">
      <h2 className="text-lg font-semibold">LoRa Mesh Data Transfer Simulation</h2>

      {/* Nodes with dotted connectors */}
      <div className="grid grid-cols-4 gap-4 text-sm relative">
        {NODES.map((node, index) => (
          <div
            key={node.id}
            className={`flex flex-col items-center gap-1 w-full ${
              index < NODES.length - 1 
                ? "border-r-[3px] border-dotted border-gray-400 pr-4" 
                : ""
            }`}
          >
            <div
              className={`w-full rounded p-2 flex flex-col items-center gap-1 text-white text-xs font-medium transition-all duration-300 ${
                currentNode === node.id 
                  ? "scale-105 bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg" 
                  : "bg-gray-800"
              }`}
            >
              {node.icon}
              <span className="text-center">{node.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Progress value={progress} className="h-3 bg-gray-900" />
        <div 
          className="absolute inset-0 h-3 bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-300"
          style={{
            width: `${progress}%`,
            right: progressDirection === 'rtl' ? 0 : undefined,
            left: progressDirection === 'ltr' ? 0 : undefined
          }}
        />
      </div>

      {/* Unified chat interface */}
      <div className="h-60 overflow-y-auto bg-gray-950 text-white p-3 rounded text-sm space-y-4">
        {chat.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === "A" ? "justify-start" : "justify-end"}`}>
            <div className={`flex items-start gap-2 ${msg.from === "A" ? "flex-row" : "flex-row-reverse"}`}>
              {/* User avatars */}
              <div className="mt-2">
                {msg.from === "A" ? (
                  <User className="h-5 w-5 text-cyan-400" />
                ) : (
                  <User2 className="h-5 w-5 text-purple-400" />
                )}
              </div>
              
              {/* Message bubble */}
              <div
                className={`max-w-[75%] p-3 rounded-lg ${msg.from === "A" ? "bg-cyan-900" : "bg-purple-900"}`}
                style={msg.from === "B" ? { direction: "rtl", textAlign: "right" } : undefined}
              >
                <div className="text-sm mb-1">{msg.text}</div>
                <div className="flex items-center justify-end gap-2 text-xs text-gray-400">
                  <span>
                    {msg.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {msg.delivered && <CheckCheck className="h-4 w-4 text-blue-400" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-4">
        <div className="w-1/2 space-y-2">
          <Input
            placeholder="Device A → B message"
            value={messageA}
            disabled={simulating}
            onChange={(e) => setMessageA(e.target.value)}
          />
          <Button
            onClick={() => {
              if (messageA.trim()) simulateTransfer(messageA, "A")
              setMessageA("")
            }}
            disabled={simulating || !messageA.trim()}
            className="w-full"
          >
            Send from A
          </Button>
        </div>
        <div className="w-1/2 space-y-2">
          <Input
            placeholder="Device B → A message"
            value={messageB}
            disabled={simulating}
            onChange={(e) => setMessageB(e.target.value)}
          />
          <Button
            onClick={() => {
              if (messageB.trim()) simulateTransfer(messageB, "B")
              setMessageB("")
            }}
            disabled={simulating || !messageB.trim()}
            className="w-full"
          >
            Send from B
          </Button>
        </div>
      </div>
    </Card>
  )
}
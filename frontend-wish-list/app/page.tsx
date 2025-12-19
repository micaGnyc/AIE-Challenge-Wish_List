"use client"

import type React from "react"

import { useState } from "react"
import { Sparkles, TreePine, Snowflake, Zap, Cookie, Plus, Send, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Wish = {
  id: number
  text: string
  verdict: "NICE" | "NAUGHTY"
}

type Theme = {
  id: "classic" | "snow" | "aurora" | "gingerbread"
  name: string
  icon: React.ReactNode
  unlockAt: number
}

type Message = {
  id: number
  text: string
  sender: "user" | "santa"
}

export default function SantaWishList() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [currentWish, setCurrentWish] = useState("")
  const [christmasSpirit, setChristmasSpirit] = useState(0)
  const [selectedTheme, setSelectedTheme] = useState<Theme["id"]>("classic")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Ho ho ho! Welcome to my magical wish list! Tell me what you wish for this Christmas! 🎅",
      sender: "santa",
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [finalVerdict, setFinalVerdict] = useState<string | null>(null)
const [isSubmittingList, setIsSubmittingList] = useState(false)
const [cvText, setCvText] = useState<string>("")
const [isUploadingCV, setIsUploadingCV] = useState(false)
const [panelQuestion, setPanelQuestion] = useState("")
const [panelResponses, setPanelResponses] = useState<{angel: string, devil: string, nicholas: string} | null>(null)
const [isPanelLoading, setIsPanelLoading] = useState(false)

const themeColors = {
  classic: {
    primary: "bg-christmas-green",
    primaryHover: "hover:bg-christmas-green/90",
    secondary: "bg-christmas-red",
    border: "border-amber-600",
    accent: "text-christmas-green",
  },
  snow: {
    primary: "bg-blue-500",
    primaryHover: "hover:bg-blue-600",
    secondary: "bg-slate-400",
    border: "border-blue-300",
    accent: "text-blue-600",
  },
  aurora: {
    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    secondary: "bg-teal-500",
    border: "border-purple-400",
    accent: "text-purple-600",
  },
  gingerbread: {
    primary: "bg-amber-700",
    primaryHover: "hover:bg-amber-800",
    secondary: "bg-orange-500",
    border: "border-amber-800",
    accent: "text-amber-700",
  },
}

const currentTheme = themeColors[selectedTheme]
  const themes: Theme[] = [
    { id: "classic", name: "Classic", icon: <TreePine className="w-4 h-4" />, unlockAt: 0 },
    { id: "snow", name: "Snow", icon: <Snowflake className="w-4 h-4" />, unlockAt: 20 },
    { id: "aurora", name: "Aurora", icon: <Zap className="w-4 h-4" />, unlockAt: 60 },
    { id: "gingerbread", name: "Gingerbread", icon: <Cookie className="w-4 h-4" />, unlockAt: 100 },
  ]

  const addWish = () => {
    if (!currentWish.trim()) return

    const verdict = Math.random() > 0.3 ? "NICE" : "NAUGHTY"
    const newWish: Wish = {
      id: Date.now(),
      text: currentWish,
      verdict,
    }

    const newWishes = [...wishes, newWish]
    setWishes(newWishes)
    setCurrentWish("")

    // Update Christmas Spirit based on number of wishes
    const newSpirit = Math.min((newWishes.length / 10) * 100, 100)
    setChristmasSpirit(newSpirit)
  }

  const completeWishList = async () => {
    if (wishes.length === 0 || isSubmittingList) return
  
    setIsSubmittingList(true)
  
    const wishSummary = wishes
      .map((w, i) => `${i + 1}. "${w.text}" (marked as ${w.verdict})`)
      .join("\n")
  
    const message = `Please review my complete Christmas wish list and give me your final verdict:\n\n${wishSummary}\n\nAm I on the Nice List or Naughty List this year?`
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        },
      )
  
      const data = await response.json()
      setFinalVerdict(data.reply || "Santa couldn't decide... try again!")
    } catch (error) {
      setFinalVerdict("Ho ho ho! My magic connection seems to be having trouble. Try again in a moment! 🎅")
    } finally {
      setIsSubmittingList(false)
    }
  }
  
  const uploadCV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.name.endsWith('.pdf')) {
      alert('Please select a PDF file')
      return
    }
  
    setIsUploadingCV(true)
    const formData = new FormData()
    formData.append('file', file)
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload-cv`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await response.json()
      if (data.cv_text) {
        setCvText(data.cv_text)
      }
    } catch (error) {
      alert('Error uploading CV. Please try again.')
    } finally {
      setIsUploadingCV(false)
    }
  }
  
  const askPanel = async () => {
    if (!panelQuestion.trim() || isPanelLoading) return
  
    setIsPanelLoading(true)
    setPanelResponses(null)
  
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat/panel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            message: panelQuestion,
            cv_context: cvText
          }),
        },
      )
  
      const data = await response.json()
      setPanelResponses({
        angel: data.angel,
        devil: data.devil,
        nicholas: data.nicholas
      })
    } catch (error) {
      alert('Error getting responses. Please try again.')
    } finally {
      setIsPanelLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      text: currentMessage,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: currentMessage }),
        },
      )

      const data = await response.json()

      const santaMessage: Message = {
        id: Date.now() + 1,
        text: data.reply || "Ho ho ho! That's a wonderful message!",
        sender: "santa",
      }

      setMessages((prev) => [...prev, santaMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Ho ho ho! My magic connection seems to be having trouble. Try again in a moment! 🎅",
        sender: "santa",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#3d2817] overflow-hidden relative">
      {/* Animated Snowflakes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-fall opacity-80"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        {/* Santa Image */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <img src="/images/cool-santa.png" alt="Cool Santa" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-full p-2 shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Main Parchment Scroll */}
        <Card className="bg-[#f5ebe0] border-8 border-amber-600 shadow-2xl rounded-3xl overflow-hidden parchment-scroll">
          <div className="p-8">
            {/* Title */}
            <div className="text-center mb-8">
            <h1 className={`text-5xl font-serif ${currentTheme.accent} mb-2 font-bold`}>Santa's Magical Wish List</h1>
              <p className="text-lg text-[#6b4423] italic">Write your wishes upon the enchanted scroll</p>
            </div>

            {/* Christmas Spirit Meter */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#6b4423]">Christmas Spirit Meter</h3>
                <span className="text-lg font-bold text-christmas-green">{Math.round(christmasSpirit)}%</span>
              </div>
              <div className="w-full h-8 bg-amber-200 rounded-full overflow-hidden border-2 border-amber-600 relative">
                <div
className={`h-full ${currentTheme.primary} transition-all duration-500 relative`}                  style={{ width: `${christmasSpirit}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {christmasSpirit > 10 && (
                      <>
                        <Sparkles className="w-4 h-4 text-white animate-pulse mx-1" />
                        <Sparkles className="w-3 h-3 text-yellow-200 animate-pulse mx-1" />
                        <Sparkles className="w-4 h-4 text-white animate-pulse mx-1" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Unlocking System */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#6b4423] mb-4">Magical Themes</h3>
              <div className="grid grid-cols-4 gap-4">
                {themes.map((theme) => {
                  const isUnlocked = christmasSpirit >= theme.unlockAt
                  const isSelected = selectedTheme === theme.id

                  return (
                    <button
                      key={theme.id}
                      onClick={() => isUnlocked && setSelectedTheme(theme.id)}
                      disabled={!isUnlocked}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isUnlocked
                          ? isSelected
                            ? "bg-christmas-green text-white border-christmas-green shadow-lg scale-105"
                            : "bg-white border-amber-400 hover:border-christmas-green hover:shadow-md"
                          : "bg-gray-200 border-gray-300 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {theme.icon}
                        <span className="text-sm font-medium">{theme.name}</span>
                        {!isUnlocked && <span className="text-xs text-gray-600">{theme.unlockAt}%</span>}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Wish Input */}
            <div className="mb-8">
              <div className="flex gap-2">
                <Input
                  value={currentWish}
                  onChange={(e) => setCurrentWish(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addWish()}
                  placeholder="Type your Christmas wish here..."
                  className="flex-1 bg-white border-2 border-amber-400 text-[#6b4423] placeholder:text-amber-600/50 focus:border-christmas-green text-base h-12"
                />
                <Button onClick={addWish} className="bg-christmas-red hover:bg-christmas-red/90 text-white h-12 px-6">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Wish List */}
            {wishes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#6b4423] mb-4">Your Wishes</h3>
                <div className="space-y-3">
                  {wishes.map((wish, index) => (
                    <div key={wish.id} className="bg-white/80 p-4 rounded-lg border-2 border-amber-300 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <span className="font-semibold text-christmas-green mr-2">{index + 1}.</span>
                          <span className="text-[#6b4423]">{wish.text}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#6b4423] font-medium">Santa's verdict:</span>
                          {wish.verdict === "NICE" ? (
                            <span className="bg-christmas-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                              NICE
                            </span>
                          ) : (
                            <span className="bg-christmas-red text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                              NAUGHTY <Flame className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
  onClick={completeWishList}
  disabled={isSubmittingList || finalVerdict !== null}
  className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white h-12 text-base font-semibold disabled:opacity-50"
>
  {isSubmittingList ? "Santa is reviewing..." : finalVerdict ? "List Submitted! ✓" : "Complete My List"}
</Button>

{finalVerdict && (
  <div className="mt-6 p-4 bg-white/90 rounded-xl border-2 border-christmas-green">
    <h4 className="text-lg font-semibold text-christmas-green mb-2">🎅 Santa's Final Verdict:</h4>
    <p className="text-[#6b4423] whitespace-pre-wrap">{finalVerdict}</p>
  </div>
)}
              </div>
            )}
          </div>
        </Card>
{/* Santa's Gift - Career Coaching Panel */}
{finalVerdict && (
  <Card className="mt-8 bg-[#f5ebe0] border-8 border-amber-600 shadow-2xl rounded-3xl overflow-hidden">
    <div className="p-6">
      <h2 className="text-3xl font-serif text-christmas-green mb-2 font-bold text-center">🎁 Santa's Gift 🎁</h2>
      <p className="text-center text-[#6b4423] mb-6 italic">Everyone deserves guidance! Upload your CV and get wisdom from all three advisors.</p>
      
      {/* CV Upload */}
      <div className="mb-6 text-center">
        <label className="cursor-pointer inline-block">
          <div className={`px-6 py-3 rounded-xl border-2 border-dashed ${cvText ? 'border-green-400 bg-green-50' : 'border-amber-400 bg-white'} hover:border-amber-600 transition-all`}>
            {isUploadingCV ? (
              <span className="text-[#6b4423]">Uploading...</span>
            ) : cvText ? (
              <span className="text-green-700">✓ CV Uploaded! Click to replace</span>
            ) : (
              <span className="text-[#6b4423]">📄 Upload your CV (PDF) for personalized advice</span>
            )}
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={uploadCV}
            className="hidden"
          />
        </label>
      </div>

      {/* Question Input */}
      {cvText && (
        <div className="mb-6">
          <div className="flex gap-2">
            <Input
              value={panelQuestion}
              onChange={(e) => setPanelQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && askPanel()}
              placeholder="Ask a question about your career or life..."
              disabled={isPanelLoading}
              className="flex-1 bg-white border-2 border-amber-400 text-[#6b4423] placeholder:text-amber-600/50 focus:border-amber-600 text-base h-12"
            />
            <Button
              onClick={askPanel}
              disabled={isPanelLoading || !panelQuestion.trim()}
              className="bg-amber-600 hover:bg-amber-700 text-white h-12 px-6"
            >
              {isPanelLoading ? "Asking..." : <Send className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      )}

      {/* Panel Responses */}
      {isPanelLoading && (
        <div className="text-center py-8">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <p className="text-[#6b4423] italic">Your advisors are thinking...</p>
        </div>
      )}

      {panelResponses && (
        <div className="space-y-4">
          {/* Angel & Devil Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Angel Response */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">😇</span>
                <h3 className="font-bold text-blue-700">Angel Coach</h3>
              </div>
              <p className="text-blue-900 text-sm leading-relaxed whitespace-pre-wrap">{panelResponses.angel}</p>
            </div>

            {/* Devil Response */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">😈</span>
                <h3 className="font-bold text-red-700">Devil Coach</h3>
              </div>
              <p className="text-red-900 text-sm leading-relaxed whitespace-pre-wrap">{panelResponses.devil}</p>
            </div>
          </div>

          {/* Santa Row */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎅</span>
              <h3 className="font-bold text-green-700">Santa's Wisdom</h3>
            </div>
            <p className="text-green-900 text-sm leading-relaxed whitespace-pre-wrap">{panelResponses.nicholas}</p>
          </div>
        </div>
      )}
    </div>
  </Card>
)}
</div>
    </div>
  )
}
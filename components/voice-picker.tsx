import * as React from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { voices } from "@/utils/voices"
import { Play, Pause, BookAudio, MousePointer2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface VoicePickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (voice: string) => any
}

export function VoicePicker({ open, onOpenChange, onSelect }: VoicePickerProps) {
  const isMobile = useIsMobile()
  const [playingAudio, setPlayingAudio] = React.useState<HTMLAudioElement | null>(null)
  const [playingVoiceId, setPlayingVoiceId] = React.useState<string | null>(null)

  const handlePlaySample = (sampleUrl: string, voiceName: string) => {
    if (playingAudio) {
      playingAudio.pause()
      setPlayingAudio(null)
      setPlayingVoiceId(null)
      
      // If clicking the same voice that's playing, just stop it
      if (playingVoiceId === voiceName) {
        return
      }
    }

    const audio = new Audio(sampleUrl)
    audio.play()
    setPlayingAudio(audio)
    setPlayingVoiceId(voiceName)

    audio.addEventListener('ended', () => {
      setPlayingAudio(null)
      setPlayingVoiceId(null)
    })
  }

  const VoiceList = () => (
    <div className="grid gap-3 max-h-[400px] overflow-y-auto">
        {voices.map((voice) => (
            <div
            key={voice.name}
            className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50"
            >
            <div className="flex flex-col gap-1">
                <div className="font-medium">{voice.name}</div>
                <div className="text-sm text-gray-500 capitalize">
                    {voice.accent} • {voice.style} • {voice.gender}
                </div>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePlaySample(voice.sample, voice.name)}
                >
                {playingVoiceId === voice.name ? (
                    <Pause className="h-4 w-4" />
                ) : (
                    <Play className="h-4 w-4" />
                )}
                </Button>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" onClick={() => onSelect(voice.value)}>
                            <MousePointer2 className="size-4"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Select</p>
                    </TooltipContent>
                </Tooltip>
            </div>
            </div>
        ))}
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
            <Button 
                size="icon" 
                variant="outline"
                className="rounded-full w-12 h-12"
            >
                <BookAudio className="size-4"/>
            </Button>
        </DrawerTrigger>

        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Select Voice</DrawerTitle>
                <DrawerDescription>Pick a voice to use for audio playback</DrawerDescription>
            </DrawerHeader>

            {VoiceList()}

            <DrawerFooter>
                <DrawerClose>Close</DrawerClose>
            </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button 
                        size="icon" 
                        variant="outline"
                        className="rounded-full w-12 h-12"
                    >
                        <BookAudio className="size-4"/>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Select Voice</p>
                </TooltipContent>
            </Tooltip>
        </DialogTrigger>


        <DialogContent>
            <DialogHeader>
                <DialogTitle>Select Voice</DialogTitle>
                <DialogDescription>Pick a voice to use for audio playback</DialogDescription>
            </DialogHeader>

            {VoiceList()}
            <DialogFooter>
                <DialogClose>Close Picker</DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

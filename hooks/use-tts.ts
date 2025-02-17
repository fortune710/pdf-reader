import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useRef, useState } from "react"

interface TTSData {
    pageNumber: number,
    pageText: string,
    documentId: string,
    voice: string,
    tempertaure: number | null,
}

export default function useTTS(data: TTSData) {
    const { pageNumber, pageText, documentId, voice, tempertaure } = data
    const audioContext = useRef<AudioContext | null>(null)
    const sourceNode = useRef<AudioBufferSourceNode | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const tempertaureSetting = String(tempertaure) || "DEFAULT"

    

    const { isLoading, refetch, isFetching } = useQuery({
        queryKey: ['tts', pageNumber, documentId, voice, tempertaureSetting],
        queryFn: async () => {
            // Create AudioContext on first play
            if (!audioContext.current) {
                audioContext.current = new AudioContext()
            }

            const response = await axios.post("https://api.play.ai/api/v1/tts/stream", {
                text: pageText,
                model: "PlayDialog",
                voice: "s3://voice-cloning-zero-shot/baf1ef41-36b6-428c-9bdf-50ba54682bd8/original/manifest.json"
            }, {
                headers: {
                    Authorization: process.env.NEXT_PUBLIC_PLAY_AI_KEY,
                    'X-USER-ID': process.env.NEXT_PUBLIC_USER_ID,
                    "Content-Type": "application/json"
                },
                responseType: 'arraybuffer'
            })

            const audioData = response.data
            const audioBuffer = await audioContext.current.decodeAudioData(audioData)
            
            console.log(audioData, audioBuffer)
            // Create and configure source node
            sourceNode.current = audioContext.current.createBufferSource()
            sourceNode.current.buffer = audioBuffer
            sourceNode.current.connect(audioContext.current.destination)
            
            return audioBuffer
        },
        enabled: !!pageText
    })

    const play = async () => {
        if (!sourceNode.current || !audioContext.current) {
            await refetch()
        }
        
        if (audioContext.current?.state === 'suspended') {
            await audioContext.current.resume()
        }

        if (sourceNode.current && !isPlaying) {
            sourceNode.current.start()
            setIsPlaying(true)
        }
    }

    const pause = () => {
        if (audioContext.current && isPlaying) {
            audioContext.current.suspend()
            setIsPlaying(false)
        }
    }

    const stop = () => {
        if (sourceNode.current) {
            sourceNode.current.stop()
            sourceNode.current.disconnect()
            sourceNode.current = null
            setIsPlaying(false)
        }
    }

    const handleAudioPlayback = () => {
        if (isLoading) return;
        
        if (isPlaying) {
            pause();
        } else {
            play();
        }

    }

    return {
        isLoading: isLoading || isFetching,
        isPlaying,
        play,
        pause,
        stop,
        handleAudioPlayback
    }
}
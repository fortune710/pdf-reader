import { useQuery } from "@tanstack/react-query"
import { useRef, useState, useEffect } from "react"

interface TTSData {
    pageNumber: number,
    pageText: string,
    documentId: string,
    voice: string,
    tempertaure: number | null,
}

export default function useTTS(data: TTSData) {
    const { pageNumber, pageText, documentId, voice, tempertaure } = data
    const audioElement = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [progress, setProgress] = useState(0)
    const abortControllerRef = useRef<AbortController | null>(null)
    const audioQueue = useRef<Uint8Array[]>([])
    const audioUrl = useRef<string | null>(null)

    const tempertaureSetting = String(tempertaure) || "DEFAULT"

    // Initialize audio elements
    useEffect(() => {
        if (!audioElement.current) {
            audioElement.current = new Audio()
            audioElement.current.addEventListener('ended', () => {
                setIsPlaying(false)
            })
            audioElement.current.addEventListener('pause', () => {
                setIsPlaying(false)
            })
            audioElement.current.addEventListener('play', () => {
                setIsPlaying(true)
            })
        }

        return () => {
            if (audioUrl.current) {
                URL.revokeObjectURL(audioUrl.current)
            }
        }
    }, [])

    const { isLoading, isFetching, refetch } = useQuery({
        queryKey: ['tts', pageNumber, documentId, voice, tempertaureSetting],
        queryFn: async () => {
            // Reset state
            setIsReady(false)
            setProgress(0)
            audioQueue.current = []
            
            if (audioUrl.current) {
                URL.revokeObjectURL(audioUrl.current)
                audioUrl.current = null
            }
            
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            abortControllerRef.current = new AbortController()
            
            try {
                //TODO: Try to get the audio to start playing once bytes are available
                const response = await fetch("https://api.play.ai/api/v1/tts/stream", {
                    method: "POST",
                    body: JSON.stringify({
                        text: pageText,
                        model: "PlayDialog",
                        voice
                    }),
                    headers: {
                        'Authorization': process.env.NEXT_PUBLIC_PLAY_AI_KEY || '',
                        'X-USER-ID': process.env.NEXT_PUBLIC_USER_ID || '',
                        "Content-Type": "application/json",
                        "Accept": "audio/mpeg"
                    },
                    signal: abortControllerRef.current.signal
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                if (!response.body) {
                    throw new Error("Response body is null")
                }

                // Create a new Blob to hold the audio data
                const audioChunks: Uint8Array[] = []
                const reader = response.body.getReader()
                
                // Read and process the stream
                while (true) {
                    const { done, value } = await reader.read()
                    
                    if (done) {
                        break
                    }
                    
                    audioChunks.push(value)
                    audioQueue.current.push(value)
                    
                    // Update progress
                    setProgress(audioChunks.length)
                    
                    // If this is the first chunk, we can prepare for playing
                    if (audioChunks.length === 1) {
                        // Create a blob from the chunks we have so far
                        const blob = new Blob(audioChunks, { type: 'audio/mpeg' })
                        audioUrl.current = URL.createObjectURL(blob)
                        
                        if (audioElement.current) {
                            audioElement.current.src = audioUrl.current
                            audioElement.current.load()
                            setIsReady(true)
                        }
                    } else if (isReady && isPlaying) {
                        // If we're already playing, we need to update the audio source
                        // This is a bit tricky with native Audio elements, so we'll
                        // just create a new blob with all chunks received so far
                        const blob = new Blob(audioChunks, { type: 'audio/mpeg' })
                        
                        // Remember the current position
                        const currentTime = audioElement.current?.currentTime || 0
                        
                        // Update the audio source
                        if (audioUrl.current) {
                            URL.revokeObjectURL(audioUrl.current)
                        }
                        audioUrl.current = URL.createObjectURL(blob)
                        
                        if (audioElement.current) {
                            const wasPlaying = !audioElement.current.paused
                            audioElement.current.src = audioUrl.current
                            audioElement.current.load()
                            audioElement.current.currentTime = currentTime
                            
                            if (wasPlaying) {
                                audioElement.current.play().catch(console.error)
                            }
                        }
                    }
                }
                
                // Create the final audio blob
                const finalBlob = new Blob(audioChunks, { type: 'audio/mpeg' })
                
                if (audioUrl.current) {
                    URL.revokeObjectURL(audioUrl.current)
                }
                audioUrl.current = URL.createObjectURL(finalBlob)
                
                if (audioElement.current) {
                    // Remember the current position
                    const currentTime = audioElement.current.currentTime || 0
                    const wasPlaying = !audioElement.current.paused
                    
                    audioElement.current.src = audioUrl.current
                    audioElement.current.load()
                    audioElement.current.currentTime = currentTime
                    
                    if (wasPlaying) {
                        audioElement.current.play().catch(console.error)
                    }
                }
                
                return true
            } catch (error) {
                if ((error as Error).name === 'AbortError') {
                    console.log('Fetch aborted')
                } else {
                    console.error('Fetch error:', error)
                }
                return false
            }
        },
        enabled: !!pageText,
    })

    const play = async () => {
        if (isPlaying) return
        
        if (!isReady) {
            await refetch()
            return
        }
        
        if (audioElement.current) {
            try {
                await audioElement.current.play()
                setIsPlaying(true)
            } catch (error) {
                console.error('Error playing audio:', error)
            }
        }
    }

    const pause = () => {
        if (!isPlaying || !audioElement.current) return
        
        audioElement.current.pause()
        setIsPlaying(false)
    }

    const stop = () => {
        if (audioElement.current) {
            audioElement.current.pause()
            audioElement.current.currentTime = 0
        }
        
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        
        if (audioUrl.current) {
            URL.revokeObjectURL(audioUrl.current)
            audioUrl.current = null
        }
        
        audioQueue.current = []
        setIsPlaying(false)
        setIsReady(false)
        setProgress(0)
    }

    const handleAudioPlayback = () => {
        if (isLoading || (isFetching && !isReady)) return
        
        if (isPlaying) {
            pause()
        } else {
            play()
        }
    }

    return {
        isLoading: isLoading || (isFetching && !isReady),
        isPlaying,
        isReady,
        progress,
        play,
        pause,
        stop,
        handleAudioPlayback
    }
}
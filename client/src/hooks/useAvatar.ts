import StreamingAvatar, {
  AvatarQuality,
  StartAvatarResponse,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from '@heygen/streaming-avatar'
import { useState, useRef, useEffect, useCallback } from 'react'

const useAvatar = ({ language = 'en' }: { language?: string }) => {
  const [isLoadingSession, setIsLoadingSession] = useState(false)
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false)
  const [stream, setStream] = useState<MediaStream>()
  const [debug, setDebug] = useState<string>()
  const [knowledgeId, setKnowledgeId] = useState<string>('')
  const [avatarId, setAvatarId] = useState<string>('Katya_Chair_Sitting_public')

  const [data, setData] = useState<StartAvatarResponse>()
  const [text, setText] = useState<string>('')
  const mediaStream = useRef<HTMLVideoElement>(null)
  const avatar = useRef<StreamingAvatar | null>(null)
  const [chatMode, setChatMode] = useState('text_mode')
  const [isUserTalking, setIsUserTalking] = useState(false)

  async function startSession() {
    setIsLoadingSession(true)

    let newToken = ''
    try {
      // In a real application, you would get this token from your backend
      const res = await fetch(
        `${import.meta.env.VITE_HEYGEN_API_URL || 'https://api.heygen.com'}/v1/streaming.create_token`,
        {
          method: 'POST',
          headers: {
            'x-api-key': import.meta.env.VITE_HEYGEN_API_KEY || '',
          },
        },
      )

      const { data } = await res.json()
      newToken = data.token
      console.log('Access Token:', newToken)
    } catch (error) {
      console.error('Error fetching access token:', error)
    }

    avatar.current = new StreamingAvatar({
      token: newToken,
      basePath: import.meta.env.VITE_HEYGEN_API_URL || 'https://api.heygen.com',
    })
    
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log('Avatar started talking', e)
    })
    
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log('Avatar stopped talking', e)
    })
    
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log('Stream disconnected')
      endSession()
    })
    
    avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
      console.log('Stream ready:', event.detail)
      setStream(event.detail)
    })
    
    avatar.current?.on(StreamingEvents.USER_START, (event) => {
      console.log('User started talking:', event)
      setIsUserTalking(true)
    })
    
    avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
      console.log('User stopped talking:', event)
      setIsUserTalking(false)
    })
    
    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: avatarId,
        knowledgeId: knowledgeId, 
        voice: {
          rate: 1.5,
          emotion: VoiceEmotion.EXCITED,
        },
        language: language,
        disableIdleTimeout: true,
      })

      setData(res)
    } catch (error) {
      console.error('Error starting avatar session:', error)
    } finally {
      setIsLoadingSession(false)
    }
  }
  
  async function handleSpeak(text: string) {
    setIsLoadingRepeat(true)
    if (!avatar.current) {
      setDebug('Avatar API not initialized')
      return
    }
    
    await avatar.current
      .speak({ text, taskType: TaskType.REPEAT, taskMode: TaskMode.SYNC })
      .catch((e) => {
        setDebug(e.message)
      })
    setIsLoadingRepeat(false)
  }
  
  async function handleInterrupt() {
    if (!avatar.current) {
      setDebug('Avatar API not initialized')
      return
    }
    
    await avatar.current.interrupt().catch((e) => {
      setDebug(e.message)
    })
  }
  
  async function endSession() {
    console.log('Ending session')
    await avatar.current?.stopAvatar()
    setStream(undefined)
  }

  const handleChangeChatMode = useCallback(async (v: string) => {
    if (v === chatMode) {
      return
    }
    
    if (v === 'text_mode') {
      avatar.current?.closeVoiceChat()
    } else {
      await avatar.current?.startVoiceChat()
    }
    
    setChatMode(v)
  }, [chatMode])

  useEffect(() => {
    return () => {
      endSession()
    }
  }, [])

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play()
        setDebug('Playing')
      }
    }
  }, [mediaStream, stream])

  return {
    startSession,
    endSession,
    mediaStream,
    isLoadingSession,
    isLoadingRepeat,
    handleSpeak,
    handleInterrupt,
    setText,
    setAvatarId,
    setKnowledgeId,
    data,
    text,
    chatMode,
    handleChangeChatMode,
    isUserTalking,
    stream,
    avatarId,
    knowledgeId,
  }
}

export default useAvatar
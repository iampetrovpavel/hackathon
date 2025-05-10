import { useEffect, useRef } from 'react'
import useAvatar from '../../hooks/useAvatar'
import { Button } from '../ui/button'
import InteractiveAvatarTextInput from './InteractiveAvatarTextInput'

export function StreamingAvatar() {
  const { 
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
    knowledgeId
  } = useAvatar({ language: 'en' })

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="h-[500px] flex flex-col justify-center items-center bg-gray-50 rounded-lg">
        {stream ? (
          <div className="h-[500px] w-full justify-center items-center flex rounded-lg overflow-hidden relative">
            <video
              ref={mediaStream}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            >
              <track kind="captions" />
            </video>
            <div className="flex flex-col gap-2 absolute bottom-3 right-3">
              <Button
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
                onClick={handleInterrupt}
              >
                Interrupt
              </Button>
              <Button
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white rounded-lg"
                onClick={endSession}
              >
                End session
              </Button>
            </div>
          </div>
        ) : !isLoadingSession ? (
          <div className="h-full justify-center items-center flex flex-col gap-8 w-[500px] self-center">
            <div className="flex flex-col gap-2 w-full">
              <p className="text-sm font-medium leading-none">
                Custom Knowledge ID (optional)
              </p>
              <input 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter a custom knowledge ID"
                value={knowledgeId}
                onChange={(e) => setKnowledgeId(e.target.value)}
              />
              <p className="text-sm font-medium leading-none">
                Custom Avatar ID (optional)
              </p>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter a custom avatar ID"
                value={avatarId}
                onChange={(e) => setAvatarId(e.target.value)}
              />
            </div>
            <Button
              className="bg-gradient-to-tr from-indigo-500 to-indigo-300 w-full text-white"
              onClick={startSession}
            >
              Start session
            </Button>
          </div>
        ) : (
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        )}
      </div>
      <div className="flex flex-col gap-3 relative">
        {stream && (
          <div className="w-full flex relative">
            <InteractiveAvatarTextInput
              disabled={!stream}
              input={text}
              loading={isLoadingRepeat}
              placeholder="Type something for the avatar to respond"
              setInput={setText}
              onSubmit={handleSpeak}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default StreamingAvatar
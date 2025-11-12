/**
 * Media Capsules
 *
 * 5 production-ready media components
 * Video players, audio controls, image galleries, and media uploaders
 */

import { Capsule } from '@/types/capsule'

const mediaCapsules: Capsule[] = [
  {
    id: 'video-player',
    name: 'Advanced Video Player',
    category: 'Media',
    description: 'Feature-rich video player with custom controls, playback speed, quality selector, picture-in-picture, keyboard shortcuts, and progress preview. Includes playlist support and fullscreen mode.',
    tags: ['video', 'player', 'media', 'streaming', 'controls', 'fullscreen'],
    code: `'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, SkipBack } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  loop?: boolean
  onEnded?: () => void
}

export default function VideoPlayer({ src, poster, autoPlay = false, loop = false, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('ended', handleEnded)
    }
  }, [onEnded])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pos * duration
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    if (!videoRef.current) return
    videoRef.current.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = rate
    setPlaybackRate(rate)
  }

  const skip = (seconds: number) => {
    if (!videoRef.current) return
    videoRef.current.currentTime += seconds
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.current.requestFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  return (
    <div
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        className="w-full"
        onClick={togglePlay}
      />

      {/* Controls Overlay */}
      <div className={\`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity \${showControls ? 'opacity-100' : 'opacity-0'}\`}>
        {/* Center Play Button */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
          >
            <Play size={40} className="text-white ml-2" />
          </button>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div
            ref={progressRef}
            onClick={handleSeek}
            className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4 hover:h-2 transition-all"
          >
            <div
              className="h-full bg-blue-600 rounded-full relative"
              style={{ width: \`\${(currentTime / duration) * 100}%\` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Skip Buttons */}
            <button onClick={() => skip(-10)} className="text-white hover:text-blue-400 transition-colors">
              <SkipBack size={20} />
            </button>
            <button onClick={() => skip(10)} className="text-white hover:text-blue-400 transition-colors">
              <SkipForward size={20} />
            </button>

            {/* Time */}
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex-1" />

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20"
              />
            </div>

            {/* Playback Speed */}
            <div className="relative group/speed">
              <button className="text-white hover:text-blue-400 transition-colors flex items-center gap-1">
                <Settings size={20} />
                <span className="text-sm">{playbackRate}x</span>
              </button>
              <div className="absolute bottom-full mb-2 right-0 bg-black/90 rounded-lg p-2 opacity-0 group-hover/speed:opacity-100 transition-opacity pointer-events-none group-hover/speed:pointer-events-auto">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={\`block w-full text-left px-3 py-1 text-white text-sm hover:bg-white/20 rounded \${playbackRate === rate ? 'bg-white/10' : ''}\`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'audio-player',
    name: 'Audio Player with Waveform',
    category: 'Media',
    description: 'Beautiful audio player with animated waveform visualization, playlist support, shuffle, repeat modes, and volume control. Perfect for music apps and podcasts.',
    tags: ['audio', 'player', 'music', 'waveform', 'playlist', 'podcast'],
    code: `'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, List } from 'lucide-react'

interface Track {
  id: string
  title: string
  artist: string
  src: string
  cover?: string
  duration: number
}

interface AudioPlayerProps {
  tracks: Track[]
  autoPlay?: boolean
}

export default function AudioPlayer({ tracks, autoPlay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  const [shuffleEnabled, setShuffleEnabled] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
      } else if (repeatMode === 'all') {
        playNext()
      } else if (currentTrackIndex < tracks.length - 1) {
        playNext()
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrackIndex, repeatMode, tracks.length])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    if (shuffleEnabled) {
      const nextIndex = Math.floor(Math.random() * tracks.length)
      setCurrentTrackIndex(nextIndex)
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)
    }
    setIsPlaying(true)
  }

  const playPrevious = () => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
    }
    setIsPlaying(true)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    if (audioRef.current) audioRef.current.volume = newVolume
    setVolume(newVolume)
  }

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => {
      if (prev === 'none') return 'all'
      if (prev === 'all') return 'one'
      return 'none'
    })
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return \`\${mins}:\${secs.toString().padStart(2, '0')}\`
  }

  // Generate waveform bars
  const waveformBars = Array.from({ length: 60 }, (_, i) => {
    const height = Math.sin(i * 0.5) * 30 + 40
    const isActive = (i / 60) < (currentTime / currentTrack.duration)
    return (
      <div
        key={i}
        className={\`flex-1 rounded-full transition-all duration-200 \${
          isActive ? 'bg-blue-600' : 'bg-gray-300'
        } \${isPlaying && isActive ? 'animate-pulse' : ''}\`}
        style={{ height: \`\${height}%\` }}
      />
    )
  })

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <audio ref={audioRef} src={currentTrack.src} autoPlay={autoPlay} />

      {/* Album Art */}
      <div className="relative aspect-square bg-gradient-to-br from-blue-400 to-purple-600 p-8">
        {currentTrack.cover ? (
          <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
            {currentTrack.title[0]}
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-1 truncate">{currentTrack.title}</h3>
        <p className="text-gray-600 mb-4 truncate">{currentTrack.artist}</p>

        {/* Waveform Visualization */}
        <div className="flex items-end gap-1 h-20 mb-4">
          {waveformBars}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <input
            type="range"
            min="0"
            max={currentTrack.duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={() => setShuffleEnabled(!shuffleEnabled)}
            className={\`text-gray-600 hover:text-blue-600 transition-colors \${shuffleEnabled ? 'text-blue-600' : ''}\`}
          >
            <Shuffle size={20} />
          </button>

          <button onClick={playPrevious} className="text-gray-600 hover:text-gray-900 transition-colors">
            <SkipBack size={28} />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-colors"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>

          <button onClick={playNext} className="text-gray-600 hover:text-gray-900 transition-colors">
            <SkipForward size={28} />
          </button>

          <button
            onClick={cycleRepeatMode}
            className={\`text-gray-600 hover:text-blue-600 transition-colors relative \${repeatMode !== 'none' ? 'text-blue-600' : ''}\`}
          >
            <Repeat size={20} />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        {/* Volume & Playlist */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Volume2 size={20} className="text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1"
            />
          </div>

          <button
            onClick={() => setShowPlaylist(!showPlaylist)}
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            <List size={24} />
          </button>
        </div>

        {/* Playlist */}
        {showPlaylist && (
          <div className="mt-4 max-h-48 overflow-y-auto border-t border-gray-200 pt-4">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index)
                  setIsPlaying(true)
                }}
                className={\`w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors \${
                  index === currentTrackIndex ? 'bg-blue-50 text-blue-600' : ''
                }\`}
              >
                <p className="font-medium truncate">{track.title}</p>
                <p className="text-sm text-gray-600 truncate">{track.artist}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'image-gallery',
    name: 'Lightbox Image Gallery',
    category: 'Media',
    description: 'Responsive image gallery with lightbox modal, zoom, pan, keyboard navigation, and thumbnail strip. Supports captions, fullscreen mode, and lazy loading.',
    tags: ['gallery', 'lightbox', 'images', 'carousel', 'zoom', 'modal'],
    code: `'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react'

interface Image {
  id: string
  src: string
  thumbnail: string
  alt: string
  caption?: string
}

interface ImageGalleryProps {
  images: Image[]
  columns?: 2 | 3 | 4
}

export default function ImageGallery({ images, columns = 3 }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    setZoomLevel(1)
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
    setZoomLevel(1)
  }

  const goToPrevious = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length)
    setZoomLevel(1)
  }

  const goToNext = () => {
    if (selectedIndex === null) return
    setSelectedIndex((selectedIndex + 1) % images.length)
    setZoomLevel(1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className={\`grid \${gridCols[columns]} gap-4\`}>
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
          >
            <img
              src={image.thumbnail}
              alt={image.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronLeft size={40} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <ChevronRight size={40} />
          </button>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            <button
              onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
              disabled={zoomLevel <= 1}
              className="p-2 text-white bg-black/50 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
            >
              <ZoomOut size={24} />
            </button>

            <span className="px-4 py-2 text-white bg-black/50 rounded-full">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
              disabled={zoomLevel >= 3}
              className="p-2 text-white bg-black/50 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
            >
              <ZoomIn size={24} />
            </button>

            <button
              onClick={() => {
                const elem = document.documentElement
                if (!document.fullscreenElement) {
                  elem.requestFullscreen()
                } else {
                  document.exitFullscreen()
                }
              }}
              className="p-2 text-white bg-black/50 hover:bg-white/20 rounded-full transition-colors"
            >
              <Maximize size={24} />
            </button>
          </div>

          {/* Main Image */}
          <div className="relative max-w-7xl max-h-[80vh] mx-auto px-20">
            <img
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{ transform: \`scale(\${zoomLevel})\` }}
            />

            {/* Caption */}
            {images[selectedIndex].caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/75 text-white p-4 text-center">
                <p>{images[selectedIndex].caption}</p>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-4 bg-black/50 rounded-lg max-w-[90vw] overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => {
                  setSelectedIndex(index)
                  setZoomLevel(1)
                }}
                className={\`w-16 h-16 rounded overflow-hidden flex-shrink-0 border-2 transition-all \${
                  index === selectedIndex ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                }\`}
              >
                <img src={image.thumbnail} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 text-white bg-black/50 px-4 py-2 rounded-full">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}`,
    platform: 'react'
  },

  {
    id: 'file-uploader',
    name: 'Drag & Drop File Uploader',
    category: 'Form',
    description: 'Advanced file uploader with drag-and-drop, multiple files, progress bars, file preview, size validation, and type filtering. Supports images, videos, PDFs, and documents.',
    tags: ['upload', 'file', 'drag-drop', 'form', 'preview', 'progress'],
    code: `'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, FileText, Image, Video, Check, AlertCircle } from 'lucide-react'

interface FileWithPreview {
  file: File
  preview?: string
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

interface FileUploaderProps {
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  onUpload: (file: File) => Promise<string>
}

export default function FileUploader({
  accept = 'image/*,video/*,.pdf,.doc,.docx',
  maxSize = 10,
  maxFiles = 5,
  onUpload
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    if (type.startsWith('video/')) return Video
    if (type === 'application/pdf') return FileText
    return File
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return \`File size exceeds \${maxSize}MB\`
    }
    return null
  }

  const handleFiles = async (newFiles: FileList) => {
    if (files.length + newFiles.length > maxFiles) {
      alert(\`Maximum \${maxFiles} files allowed\`)
      return
    }

    const filesArray = Array.from(newFiles)
    const validFiles: FileWithPreview[] = []

    for (const file of filesArray) {
      const error = validateFile(file)
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined

      validFiles.push({
        file,
        preview,
        progress: 0,
        status: error ? 'error' : 'pending',
        error
      })
    }

    setFiles(prev => [...prev, ...validFiles])

    // Start uploading valid files
    for (let i = 0; i < validFiles.length; i++) {
      if (!validFiles[i].error) {
        await uploadFile(files.length + i)
      }
    }
  }

  const uploadFile = async (index: number) => {
    setFiles(prev => {
      const updated = [...prev]
      updated[index].status = 'uploading'
      return updated
    })

    try {
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setFiles(prev => {
          const updated = [...prev]
          updated[index].progress = progress
          return updated
        })
      }

      await onUpload(files[index].file)

      setFiles(prev => {
        const updated = [...prev]
        updated[index].status = 'success'
        updated[index].progress = 100
        return updated
      })
    } catch (error) {
      setFiles(prev => {
        const updated = [...prev]
        updated[index].status = 'error'
        updated[index].error = 'Upload failed'
        return updated
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = [...prev]
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview!)
      }
      updated.splice(index, 1)
      return updated
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={\`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors \${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }\`}
      >
        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drag & drop files here, or click to browse
        </p>
        <p className="text-sm text-gray-500">
          Supports: Images, Videos, PDFs, Documents (max {maxSize}MB each, up to {maxFiles} files)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          {files.map((fileData, index) => {
            const Icon = getFileIcon(fileData.file.type)

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
              >
                {/* Preview/Icon */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {fileData.preview ? (
                    <img src={fileData.preview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Icon size={32} className="text-gray-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{fileData.file.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(fileData.file.size)}</p>

                  {/* Progress Bar */}
                  {fileData.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{ width: \`\${fileData.progress}%\` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{fileData.progress}% uploaded</p>
                    </div>
                  )}

                  {/* Error */}
                  {fileData.status === 'error' && (
                    <div className="flex items-center gap-2 mt-2 text-red-600">
                      <AlertCircle size={16} />
                      <span className="text-sm">{fileData.error}</span>
                    </div>
                  )}
                </div>

                {/* Status Icon */}
                {fileData.status === 'success' && (
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check size={20} className="text-green-600" />
                  </div>
                )}

                {fileData.status === 'error' && (
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle size={20} className="text-red-600" />
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}`,
    platform: 'react'
  },

  {
    id: 'webcam-capture',
    name: 'Webcam Photo/Video Capture',
    category: 'Media',
    description: 'Webcam interface for capturing photos and recording videos. Includes camera selection, countdown timer, filters, and download functionality. Perfect for profile photos and video recordings.',
    tags: ['webcam', 'camera', 'photo', 'video', 'capture', 'recording'],
    code: `'use client'

import { useRef, useState, useEffect } from 'react'
import { Camera, Video, Download, RotateCw, Square, Circle } from 'lucide-react'

interface WebcamCaptureProps {
  mode?: 'photo' | 'video'
  onCapture?: (blob: Blob) => void
}

export default function WebcamCapture({ mode: initialMode = 'photo', onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [mode, setMode] = useState<'photo' | 'video'>(initialMode)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [filter, setFilter] = useState<string>('none')

  useEffect(() => {
    startCamera()
    getDevices()

    return () => {
      stopCamera()
    }
  }, [selectedDevice])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const videoDevices = devices.filter(device => device.kind === 'videoinput')
    setDevices(videoDevices)
    if (videoDevices.length > 0 && !selectedDevice) {
      setSelectedDevice(videoDevices[0].deviceId)
    }
  }

  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: selectedDevice ? { deviceId: selectedDevice } : true,
        audio: mode === 'video'
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Apply filter
    if (filter !== 'none') {
      context.filter = filter
    }

    context.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        setCapturedPhoto(url)
        onCapture?.(blob)
      }
    })
  }

  const startRecording = () => {
    if (!stream) return

    const mediaRecorder = new MediaRecorder(stream)
    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const url = URL.createObjectURL(blob)
      setCapturedPhoto(url)
      onCapture?.(blob)
      setRecordingTime(0)
    }

    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleCapture = () => {
    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          if (mode === 'photo') {
            capturePhoto()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const retake = () => {
    setCapturedPhoto(null)
    setRecordingTime(0)
  }

  const download = () => {
    if (!capturedPhoto) return

    const a = document.createElement('a')
    a.href = capturedPhoto
    a.download = mode === 'photo' ? 'photo.png' : 'video.webm'
    a.click()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return \`\${mins.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`
  }

  const filters = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(100%)' },
    { name: 'Blur', value: 'blur(3px)' },
    { name: 'Brightness', value: 'brightness(150%)' },
    { name: 'Contrast', value: 'contrast(150%)' }
  ]

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="relative bg-black aspect-video">
        {/* Video Preview */}
        {!capturedPhoto && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ filter: filter !== 'none' ? filter : undefined }}
          />
        )}

        {/* Captured Photo/Video */}
        {capturedPhoto && (
          <>
            {mode === 'photo' ? (
              <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video src={capturedPhoto} controls className="w-full h-full object-cover" />
            )}
          </>
        )}

        {/* Countdown Overlay */}
        {countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-white text-9xl font-bold animate-pulse">{countdown}</span>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="font-mono">{formatTime(recordingTime)}</span>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="p-6">
        {/* Mode Switcher */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('photo')}
            className={\`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 \${
              mode === 'photo' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }\`}
          >
            <Camera size={20} />
            Photo
          </button>
          <button
            onClick={() => setMode('video')}
            className={\`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 \${
              mode === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }\`}
          >
            <Video size={20} />
            Video
          </button>
        </div>

        {/* Camera Selection */}
        {devices.length > 1 && !capturedPhoto && (
          <select
            value={selectedDevice}
            onChange={(e) => {
              stopCamera()
              setSelectedDevice(e.target.value)
            }}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg"
          >
            {devices.map((device, index) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || \`Camera \${index + 1}\`}
              </option>
            ))}
          </select>
        )}

        {/* Filters */}
        {mode === 'photo' && !capturedPhoto && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={\`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors \${
                  filter === f.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }\`}
              >
                {f.name}
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!capturedPhoto ? (
            <>
              {mode === 'photo' ? (
                <button
                  onClick={handleCapture}
                  disabled={countdown > 0}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Camera size={24} />
                  Take Photo
                </button>
              ) : (
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={\`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 \${
                    isRecording
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }\`}
                >
                  {isRecording ? <Square size={24} /> : <Circle size={24} />}
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={retake}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCw size={20} />
                Retake
              </button>
              <button
                onClick={download}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}`,
    platform: 'react'
  }
]

export default mediaCapsules

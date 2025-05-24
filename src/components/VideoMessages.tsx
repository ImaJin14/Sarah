import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, Heart } from 'lucide-react';

interface VideoMessage {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  date: string;
}

const videoMessages: VideoMessage[] = [
  {
    id: 1,
    title: "Good Morning Message",
    description: "A special morning message just for you",
    thumbnail: "/videos/morning-thumb.jpg",
    videoUrl: "public/Sarah-3.MOV",
    duration: "2:30",
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Our Adventure Compilation",
    description: "A compilation of our best adventures together",
    thumbnail: "/videos/adventure-thumb.jpg",
    videoUrl: "/videos/adventure-compilation.mp4",
    duration: "5:45",
    date: "2024-02-14"
  },
  {
    id: 3,
    title: "Why I Love You",
    description: "All the reasons why you're amazing",
    thumbnail: "/videos/love-thumb.jpg",
    videoUrl: "/videos/why-i-love-you.mp4",
    duration: "3:20",
    date: "2024-03-10"
  },
  {
    id: 4,
    title: "Birthday Surprise",
    description: "A special birthday surprise message",
    thumbnail: "/videos/birthday-thumb.jpg",
    videoUrl: "/videos/birthday-surprise.mp4",
    duration: "4:10",
    date: "2024-06-15"
  }
];

const VideoMessages: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoMessage | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const openVideoModal = (video: VideoMessage) => {
    setSelectedVideo(video);
    setIsPlaying(false);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    const video = document.getElementById('video-player') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = document.getElementById('video-player') as HTMLVideoElement;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
      <div className="container mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif text-center mb-4 text-purple-800"
        >
          Video Messages for You
        </motion.h2>
        <p className="text-center text-gray-600 mb-12">
          Special moments captured just for you
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoMessages.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => openVideoModal(video)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4"
                    >
                      <Play className="w-8 h-8 text-white fill-white" />
                    </motion.div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-semibold text-gray-800 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                  <div className="text-xs text-gray-500">
                    {new Date(video.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={closeVideoModal}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white rounded-2xl overflow-hidden">
                  <div className="relative">
                    <video
                      id="video-player"
                      src={selectedVideo.videoUrl}
                      className="w-full h-96 object-cover"
                      controls={false}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    
                    {/* Custom video controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlay}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8" />
                          ) : (
                            <Play className="w-8 h-8" />
                          )}
                        </button>
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-6 h-6" />
                          ) : (
                            <Volume2 className="w-6 h-6" />
                          )}
                        </button>
                        <div className="flex-1"></div>
                        <button className="text-white hover:text-gray-300 transition-colors">
                          <Maximize2 className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-6 h-6 text-pink-500" />
                      <h3 className="text-2xl font-serif font-bold text-gray-800">
                        {selectedVideo.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Duration: {selectedVideo.duration}</span>
                      <span>{new Date(selectedVideo.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default VideoMessages;
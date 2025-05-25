import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Heart } from "lucide-react";

interface VoiceNote {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: string;
  date: string;
  waveform: number[];
}

// Hardcoded voice notes data
const hardcodedVoiceNotes: VoiceNote[] = [
  {
    id: "1",
    title: "Good Morning Message",
    description: "A sweet morning greeting just for you",
    audioUrl: "/audio/morning-message.mp3",
    duration: "1:23",
    date: "2025-05-25T08:00:00.000Z",
    waveform: [0.3, 0.7, 0.5, 0.9, 0.4, 0.8, 0.6, 0.2, 0.7, 0.5, 0.8, 0.3, 0.6, 0.9, 0.4, 0.7]
  },
  {
    id: "2",
    title: "Bedtime Story",
    description: "A gentle story to help you sleep",
    audioUrl: "/audio/bedtime-story.mp3",
    duration: "3:45",
    date: "2025-05-24T22:00:00.000Z",
    waveform: [0.2, 0.4, 0.6, 0.3, 0.8, 0.5, 0.7, 0.4, 0.6, 0.9, 0.3, 0.5, 0.7, 0.4, 0.8, 0.6]
  },
  {
    id: "3",
    title: "Daily Encouragement",
    description: "Some positive words to brighten your day",
    audioUrl: "/audio/encouragement.mp3",
    duration: "2:10",
    date: "2025-05-23T14:30:00.000Z",
    waveform: [0.5, 0.8, 0.4, 0.7, 0.6, 0.9, 0.3, 0.5, 0.8, 0.4, 0.7, 0.6, 0.2, 0.9, 0.5, 0.8]
  },
  {
    id: "4",
    title: "Weekend Plans",
    description: "Talking about our upcoming weekend together",
    audioUrl: "/audio/weekend-plans.mp3",
    duration: "1:55",
    date: "2025-05-22T17:15:00.000Z",
    waveform: [0.4, 0.6, 0.8, 0.3, 0.7, 0.5, 0.9, 0.4, 0.6, 0.8, 0.2, 0.5, 0.7, 0.6, 0.9, 0.3]
  }
];

const VoiceNotes: React.FC = () => {
  const [voiceNotes] = useState<VoiceNote[]>(hardcodedVoiceNotes);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const togglePlay = (voiceNote: VoiceNote) => {
    const audio = audioRefs.current[voiceNote.id];
    if (!audio) return;

    if (playingId === voiceNote.id) {
      audio.pause();
      setPlayingId(null);
    } else {
      if (playingId !== null) {
        audioRefs.current[playingId]?.pause();
      }
      audio.play();
      setPlayingId(voiceNote.id);
    }
  };

  const handleTimeUpdate = (voiceNote: VoiceNote) => {
    const audio = audioRefs.current[voiceNote.id];
    if (!audio) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    setProgress((prev) => ({ ...prev, [voiceNote.id]: percent }));
  };

  const handleEnded = (voiceNote: VoiceNote) => {
    setPlayingId(null);
    setProgress((prev) => ({ ...prev, [voiceNote.id]: 0 }));
  };

  return (
    <section className="py-16 bg-white rounded-2xl shadow-lg">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif text-center mb-4 text-purple-800"
        >
          Voice Messages for You
        </motion.h2>
        <p className="text-center text-gray-600 mb-12">My voice, just for your ears</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {voiceNotes.map((voiceNote, index) => (
            <motion.div
              key={voiceNote.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <audio
                ref={(el) => {
                  if (el) audioRefs.current[voiceNote.id] = el;
                }}
                src={voiceNote.audioUrl}
                onTimeUpdate={() => handleTimeUpdate(voiceNote)}
                onEnded={() => handleEnded(voiceNote)}
              />

              <div className="flex items-center gap-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => togglePlay(voiceNote)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full shadow-lg"
                >
                  {playingId === voiceNote.id ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </motion.button>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{voiceNote.title}</h3>
                  <p className="text-sm text-gray-600">{voiceNote.description}</p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">{voiceNote.duration}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(voiceNote.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Waveform */}
              <div className="flex items-center gap-1 mb-4 h-8">
                {voiceNote.waveform.map((height, i) => (
                  <motion.div
                    key={i}
                    className={`w-1 rounded-full ${
                      playingId === voiceNote.id &&
                      (progress[voiceNote.id] || 0) > (i / 16) * 100
                        ? "bg-gradient-to-t from-pink-500 to-purple-500"
                        : "bg-gray-300"
                    }`}
                    style={{ height: `${height * 100}%` }}
                    animate={{
                      scaleY: playingId === voiceNote.id ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      repeat: playingId === voiceNote.id ? Infinity : 0,
                      duration: 0.8,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-1 rounded-full transition-all duration-100"
                  style={{ width: `${progress[voiceNote.id] || 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  <span>Voice Message</span>
                </div>
                <Heart className="w-4 h-4 text-pink-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VoiceNotes;

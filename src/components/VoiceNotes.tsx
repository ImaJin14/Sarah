import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, Heart } from "lucide-react";

import { db, storage } from '../main';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

interface VoiceNote {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration?: string;
  date: string;
  uploader: string;
  waveform?: number[];
}

const VoiceNotes: React.FC = () => {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // For upload form
  const [file, setFile] = useState<File | null>(null);
  const [uploader, setUploader] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchVoiceNotes();
  }, []);

  const fetchVoiceNotes = async () => {
    const q = query(collection(db, "voiceNotes"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const notes: VoiceNote[] = [];
    querySnapshot.forEach((doc) => {
      notes.push({ id: doc.id, ...(doc.data() as any) });
    });
    setVoiceNotes(notes);
  };

  // Extract duration and waveform when audio loads
  const handleMetadataLoaded = async (voiceNote: VoiceNote) => {
    const audio = audioRefs.current[voiceNote.id];
    if (!audio) return;

    const duration = audio.duration;
    const formattedDuration = formatDuration(duration);

    try {
      const waveform = await extractWaveform(voiceNote.audioUrl);

      // Update Firestore with duration and waveform
      // (Optional: only update locally to avoid writes on every load)
      setVoiceNotes((prev) =>
        prev.map((v) =>
          v.id === voiceNote.id ? { ...v, duration: formattedDuration, waveform } : v
        )
      );
    } catch (error) {
      console.error("Waveform extraction failed:", error);
    }
  };

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

  // Upload audio file and metadata
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !uploader || !title) {
      alert("Please fill all required fields and select a file.");
      return;
    }
    setUploading(true);

    try {
      // Upload to Firebase Storage
      const storageReference = storageRef(storage, `voiceNotes/${file.name}-${Date.now()}`);
      await uploadBytes(storageReference, file);
      const downloadURL = await getDownloadURL(storageReference);

      // Add document to Firestore
      await addDoc(collection(db, "voiceNotes"), {
        title,
        description,
        audioUrl: downloadURL,
        date: new Date().toISOString(),
        uploader,
      });

      // Refresh list
      await fetchVoiceNotes();

      // Reset form
      setFile(null);
      setUploader("");
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check console for details.");
    } finally {
      setUploading(false);
    }
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

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="max-w-lg mx-auto mb-12 p-6 bg-gray-50 rounded-xl shadow"
        >
          <h3 className="mb-4 font-semibold text-lg text-gray-700">Upload New Voice Note</h3>
          <input
            type="text"
            placeholder="Uploader Name"
            value={uploader}
            onChange={(e) => setUploader(e.target.value)}
            required
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full mb-3 p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="mb-4"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>

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
                preload="metadata"
                onLoadedMetadata={() => handleMetadataLoaded(voiceNote)}
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
                  <p className="text-xs text-gray-500 italic mt-1">
                    Uploaded by: {voiceNote.uploader}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    {voiceNote.duration || "Loading..."}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(voiceNote.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Waveform */}
              <div className="flex items-center gap-1 mb-4 h-8">
                {(voiceNote.waveform || new Array(16).fill(0.2)).map((height, i) => (
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

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

async function extractWaveform(audioUrl: string, bars = 16): Promise<number[]> {
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const rawData = audioBuffer.getChannelData(0); // Get PCM data
  const samplesPerBar = Math.floor(rawData.length / bars);
  const waveform: number[] = [];

  for (let i = 0; i < bars; i++) {
    const start = i * samplesPerBar;
    const segment = rawData.slice(start, start + samplesPerBar);
    const sum = segment.reduce((acc, val) => acc + Math.abs(val), 0);
    waveform.push(sum / samplesPerBar);
  }

  const max = Math.max(...waveform);
  return waveform.map((v) => v / max);
}

export default VoiceNotes;

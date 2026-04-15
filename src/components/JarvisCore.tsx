import { motion } from "motion/react";

export default function JarvisCore({ isListening, isSpeaking }: { isListening: boolean; isSpeaking: boolean }) {
  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Ring */}
      <motion.div
        animate={{
          rotate: 360,
          scale: isListening ? [1, 1.1, 1] : 1,
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity },
        }}
        className="absolute w-full h-full border-2 border-purple-500/30 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.2)]"
      />

      {/* Middle Ring */}
      <motion.div
        animate={{
          rotate: -360,
          scale: isSpeaking ? [1, 1.2, 1] : 1,
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 0.5, repeat: Infinity },
        }}
        className="absolute w-4/5 h-4/5 border-2 border-violet-400/50 rounded-full border-dashed shadow-[0_0_30px_rgba(139,92,246,0.3)]"
      />

      {/* Inner Core */}
      <motion.div
        animate={{
          scale: isListening || isSpeaking ? [1, 1.3, 1] : 1,
          opacity: isListening ? 1 : 0.7,
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="w-24 h-24 bg-purple-500 rounded-full blur-xl opacity-50 shadow-[0_0_50px_rgba(168,85,247,0.8)]"
      />
      
      <div className="absolute w-16 h-16 bg-white rounded-full blur-sm opacity-20" />
      
      {/* Waveforms (Simulated) */}
      {(isListening || isSpeaking) && (
        <div className="absolute flex gap-1 items-center">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [10, 40, 10] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              className="w-1 bg-fuchsia-400 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseVoiceInputResult {
  isListening: boolean;
  transcript: string;
  finalResult: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  error: string | null;
}

function getFriendlyErrorMessage(error: string): string {
    const errString = String(error).toLowerCase();
    
    if (errString.includes('no-speech')) {
      return "Didn't catch that. Tap to try again.";
    }
    if (errString.includes('audio-capture')) {
      return "Microphone is unavailable.";
    }
    if (errString.includes('not-allowed') || errString.includes('permission')) {
      return "Permission denied. Please enable microphone access.";
    }
    if (errString.includes('network')) {
      return "Network error. Please check your internet connection.";
    }
    if (errString.includes('aborted')) {
        return ""; 
    }
    
    return "Something went wrong. Please try again.";
}

export function useVoiceInput(): UseVoiceInputResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const transcriptRef = useRef('');
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SILENCE_DURATION_MS = 1500; // 1.5s of silence triggers auto-stop

  // Auto-clear error after 3 seconds
  useEffect(() => {
    if (error) {
        const timer = setTimeout(() => {
            setError(null);
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [error]);

  const clearSilenceTimer = useCallback(() => {
     if (silenceTimer.current) {
         clearTimeout(silenceTimer.current);
         silenceTimer.current = null;
     }
  }, []);

  useSpeechRecognitionEvent('start', () => {
      setIsListening(true);
      setError(null);
  });
  
  useSpeechRecognitionEvent('end', () => {
      setIsListening(false);
      clearSilenceTimer();
      // On end, we commit the final text
      if (transcriptRef.current) {
          setFinalResult(transcriptRef.current);
      }
  });
  
  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript || '';
    transcriptRef.current = text;
    setTranscript(text);
    
    // Reset Silence Timer
    clearSilenceTimer();
    silenceTimer.current = setTimeout(() => {
        stopRecording();
    }, SILENCE_DURATION_MS);
  });

  useSpeechRecognitionEvent('error', (event) => {
    const errorMsg = String(event.error);
    clearSilenceTimer();
    // Ignore aborted errors
    if (!errorMsg.toLowerCase().includes('aborted')) {
        setError(getFriendlyErrorMessage(errorMsg));
    }
    setIsListening(false);
  });

  const startRecording = useCallback(async () => {
    try {
      setFinalResult(null);
      setTranscript('');
      transcriptRef.current = '';
      setError(null);
      clearSilenceTimer();
      
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        setError("Microphone permission is required.");
        return;
      }
      
      ExpoSpeechRecognitionModule.start({
        lang: "id-ID", 
        interimResults: true,
        maxAlternatives: 1,
        continuous: true, // Keep continuous to allow pauses
      });
    } catch (err) {
        if (err instanceof Error) {
            setError(getFriendlyErrorMessage(err.message));
        } else {
            setError('An unexpected error occurred.');
        }
        setIsListening(false);
    }
  }, [clearSilenceTimer]);

  const stopRecording = useCallback(() => {
    try {
        clearSilenceTimer();
        ExpoSpeechRecognitionModule.stop();
    } catch (err) {
        console.warn("Stop recording failed", err);
    }
  }, [clearSilenceTimer]);

  return {
    isListening,
    transcript,
    finalResult,
    startRecording,
    stopRecording,
    error,
  };
}

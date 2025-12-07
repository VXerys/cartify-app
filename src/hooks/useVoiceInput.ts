import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { useCallback, useState } from 'react';

export interface UseVoiceInputResult {
  isListening: boolean;
  transcript: string;
  finalResult: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  error: string | null;
}

export function useVoiceInput(): UseVoiceInputResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useSpeechRecognitionEvent('start', () => setIsListening(true));
  useSpeechRecognitionEvent('end', () => setIsListening(false));
  useSpeechRecognitionEvent('result', (event) => {
    setTranscript(event.results[0]?.transcript || '');
    if (event.isFinal) {
        setFinalResult(event.results[0]?.transcript);
    }
  });
  useSpeechRecognitionEvent('error', (event) => {
    setError(String(event.error));
    setIsListening(false);
  });

  const startRecording = useCallback(async () => {
    try {
      setFinalResult(null);
      setTranscript('');
      setError(null);
      
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        setError("Microphone permission not granted");
        return;
      }
      
      ExpoSpeechRecognitionModule.start({
        lang: "id-ID", // Indonesian
        interimResults: true,
        maxAlternatives: 1,
      });
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred.');
        }
        setIsListening(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    try {
        ExpoSpeechRecognitionModule.stop();
    } catch (err) {
        // Ignore stop errors or log them if critical
        console.warn("Stop recording failed", err);
    }
  }, []);

  return {
    isListening,
    transcript,
    finalResult,
    startRecording,
    stopRecording,
    error,
  };
}

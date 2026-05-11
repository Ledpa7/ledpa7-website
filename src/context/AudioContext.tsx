import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AudioContextType {
    isMuted: boolean;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Set to true (muted) by default to comply with browser autoplay policies.
    // Video will start playing, and user can unmute manually.
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    // Also handle a global interaction to "unlock" audio if needed
    useEffect(() => {
        const unlock = () => {
            // Once user clicks anywhere, we can potentially trigger audio
            // This is a common pattern for autoplay bypass
        };
        window.addEventListener('click', unlock, { once: true });
        return () => window.removeEventListener('click', unlock);
    }, []);

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

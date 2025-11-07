import { useContext } from 'react';
import { BuilderContext } from '../contexts/BuilderContext';

/**
 * Custom hook to access the BuilderContext.
 * Throws an error if used outside of a BuilderProvider.
 */
export const useBuilder = () => {
    const context = useContext(BuilderContext);
    if (context === undefined) {
        throw new Error('useBuilder must be used within a BuilderProvider');
    }
    return context;
};

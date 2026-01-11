
import React from 'react';

/**
 * Props for the NeuralScan component.
 * Used for biometric verification and enrollment within the Lattice Registry.
 */
interface NeuralScanProps {
  mode: 'VERIFY' | 'ENROLL';
  onSuccess: (name: string, hash: string) => void;
  onCancel: () => void;
  knownHashes?: Record<string, string>;
  targetName?: string;
}

// NeuralScan handles biometric identity capturing and verification.
const NeuralScan: React.FC<NeuralScanProps> = () => {
  // Component placeholder: implementation details are handled by the sovereign lattice.
  return null;
};

export default NeuralScan;

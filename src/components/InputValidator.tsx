// Input validation utilities for wallet addresses, tokens, and DApps

export interface ValidationResult {
  isValid: boolean;
  type: 'wallet' | 'token' | 'dapp' | null;
  confidence: number;
  message: string;
}

export const validateInput = (input: string): ValidationResult => {
  const trimmedInput = input.trim();
  
  if (!trimmedInput) {
    return {
      isValid: false,
      type: null,
      confidence: 0,
      message: "Input cannot be empty"
    };
  }

  // Check for URL pattern (DApp)
  if (isValidUrl(trimmedInput)) {
    return {
      isValid: true,
      type: 'dapp',
      confidence: 0.95,
      message: "Valid DApp URL detected"
    };
  }

  // Check for Ethereum-like address pattern
  if (isEthereumAddress(trimmedInput)) {
    // Further classify if it's likely a wallet or token contract
    const classification = classifyEthereumAddress(trimmedInput);
    return {
      isValid: true,
      type: classification.type,
      confidence: classification.confidence,
      message: classification.message
    };
  }

  // Check for Bitcoin address pattern
  if (isBitcoinAddress(trimmedInput)) {
    return {
      isValid: true,
      type: 'wallet',
      confidence: 0.9,
      message: "Valid Bitcoin address detected"
    };
  }

  // Check for other blockchain address patterns
  const otherChainResult = checkOtherChainAddresses(trimmedInput);
  if (otherChainResult.isValid) {
    return otherChainResult;
  }

  // If no pattern matches, it might still be valid but unknown format
  if (trimmedInput.length > 10 && /^[a-zA-Z0-9]+$/.test(trimmedInput)) {
    return {
      isValid: true,
      type: 'wallet',
      confidence: 0.3,
      message: "Possible wallet address (unknown format)"
    };
  }

  return {
    isValid: false,
    type: null,
    confidence: 0,
    message: "Invalid format - please enter a valid wallet address, token contract, or DApp URL"
  };
};

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function isEthereumAddress(address: string): boolean {
  // Ethereum address: 0x followed by 40 hexadecimal characters
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function classifyEthereumAddress(address: string): { type: 'wallet' | 'token', confidence: number, message: string } {
  // This is a simplified heuristic - in reality you'd want to check on-chain data
  // For now, we'll use some basic patterns
  
  // Check if it looks like a common token contract pattern
  // Many token contracts have specific patterns or are known addresses
  const commonTokenPatterns = [
    /^0x[aA]/,  // Many tokens start with 0xA
    /^0x[dD]/,  // Common pattern for DAI-like tokens
  ];

  const hasTokenPattern = commonTokenPatterns.some(pattern => pattern.test(address));
  
  if (hasTokenPattern) {
    return {
      type: 'token',
      confidence: 0.7,
      message: "Likely token contract address"
    };
  }

  return {
    type: 'wallet',
    confidence: 0.8,
    message: "Valid Ethereum wallet address"
  };
}

function isBitcoinAddress(address: string): boolean {
  // Bitcoin addresses have specific patterns
  // Legacy (P2PKH): starts with '1'
  // Script (P2SH): starts with '3'
  // Bech32 (P2WPKH/P2WSH): starts with 'bc1'
  
  const legacyPattern = /^[1][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const scriptPattern = /^[3][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const bech32Pattern = /^bc1[a-z0-9]{39,59}$/;
  
  return legacyPattern.test(address) || scriptPattern.test(address) || bech32Pattern.test(address);
}

function checkOtherChainAddresses(address: string): ValidationResult {
  // Solana addresses (Base58, 32-44 characters)
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return {
      isValid: true,
      type: 'wallet',
      confidence: 0.75,
      message: "Possible Solana wallet address"
    };
  }

  // Cardano addresses (bech32 format starting with 'addr')
  if (/^addr1[a-z0-9]{50,}$/.test(address)) {
    return {
      isValid: true,
      type: 'wallet',
      confidence: 0.9,
      message: "Valid Cardano wallet address"
    };
  }

  // Add more blockchain patterns as needed
  
  return {
    isValid: false,
    type: null,
    confidence: 0,
    message: "Unknown address format"
  };
}
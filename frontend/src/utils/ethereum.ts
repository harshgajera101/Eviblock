import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "./config";
import EvidenceRegistry from "./EvidenceRegistry.json";

// This function requests access to the user's MetaMask wallet
export const requestAccount = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error) {
      console.error("User denied account access", error);
      return null;
    }
  } else {
    console.error("MetaMask not detected");
    return null;
  }
};

// This function gets the contract instance so we can call functions on it
export const getContract = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // We connect to the contract using: Address, ABI, and the Signer (User)
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      EvidenceRegistry.abi,
      signer
    );
    
    return contract;
  }
  return null;
};
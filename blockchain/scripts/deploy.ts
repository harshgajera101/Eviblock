import { ethers } from "hardhat";

async function main() {
  // 1. Get the contract factory
  // This is like a "blueprint" for creating instances of our contract
  const EvidenceRegistry = await ethers.getContractFactory("EvidenceRegistry");

  // 2. Deploy the contract
  console.log("Deploying EvidenceRegistry...");
  const evidenceRegistry = await EvidenceRegistry.deploy();

  // 3. Wait for the deployment to finish
  await evidenceRegistry.waitForDeployment();

  // 4. Log the address
  // This address is crucial - it's where our contract lives on the blockchain
  console.log(
    `EvidenceRegistry deployed to: ${await evidenceRegistry.getAddress()}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
import { ethers } from "hardhat";

async function main() {
  // 1. Get the list of fake accounts provided by Hardhat
  const signers = await ethers.getSigners();
  
  // 2. Select the FIRST account (index 0) which is your 0xf39f... wallet
  const mainDeployer = signers[0];
  console.log(`Deploying using main account: ${mainDeployer.address}`);

  // 3. Attach this deployer to our contract factory
  const EvidenceRegistry = await ethers.getContractFactory(
    "EvidenceRegistry", 
    mainDeployer
  );

  // 4. Deploy the contract
  console.log("Deploying EvidenceRegistry...");
  const evidenceRegistry = await EvidenceRegistry.deploy();
  await evidenceRegistry.waitForDeployment();

  // 5. Log the new, clean address
  console.log(
    `EvidenceRegistry deployed to: ${await evidenceRegistry.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
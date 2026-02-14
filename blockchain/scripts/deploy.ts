import { ethers } from "hardhat";

async function main() {
  // 1. Get the list of fake accounts provided by Hardhat
  const signers = await ethers.getSigners();
  
  // 2. Select the SECOND account (index 1) to bypass the default address
  const alternateDeployer = signers[1];
  console.log(`Deploying using alternate account: ${alternateDeployer.address}`);

  // 3. Attach this new deployer to our contract factory
  const EvidenceRegistry = await ethers.getContractFactory(
    "EvidenceRegistry", 
    alternateDeployer
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
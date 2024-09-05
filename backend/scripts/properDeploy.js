const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Compile the contract
  await hre.run("compile");

  // Get the Contract factory
  const MyContract = await hre.ethers.getContractFactory("M");

  // Deploy the contract
  console.log("Deploying M...");
  const myContract = await MyContract.deploy();

  await myContract.waitForDeployment();

  console.log("MyContract deployed to:", myContract.target);

  // 0x010F1493ffcF40CEB9E20C260245f0d049E5E049

  // Verify the contract
  // console.log("Verifying contract...");
  // try {
  //   await hre.run("verify:verify", {
  //     address: myContract.target,
  //     constructorArguments: [],
  //   });
  //   console.log("Contract verified successfully");
  // } catch (error) {
  //   console.error("Error verifying contract:", error);
  // }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

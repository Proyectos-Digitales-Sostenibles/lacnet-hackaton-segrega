const { ethers } = require("ethers");
const { LacchainProvider, LacchainSigner } = require('@lacchain/gas-model-provider');
const contractAbi = require("../artifacts/contracts/Greeter.sol/Greeter.json");

async function main() {

  //LOCAL
  // const yourRPCNode = "http://127.0.0.1:4545";
  const yourRPCNode = "http://127.0.0.1:8545";
  const nodeAddress = "0x211152ca21d5daedbcfbf61173886bbb1a217242";

  //TESTNET
  //const yourRPCNode = "{{YOUR_RPC_IP_OR_URL}}";
  //const nodeAddress = "{{YOUR_NODE_ADDRESS}}";

  //MAINNET
  //const yourRPCNode = "{{YOUR_RPC_IP_OR_URL}}";
  //const nodeAddress = "{{YOUR_NODE_ADDRESS}}";

  //Contract Owner
  const privateKey = "0x0dd81424cb66a9571df6d2785f29542c5954cde036cc7ea61d8aa302210ca809";

  console.log("Starting deploy of contract: ", contractAbi.contractName);

  // current date and time + 5 miutes
  const now = new Date();
  const expiration_date = now.getTime() + (5 * 60 * 1000); // 5 minutes

  const provider = new LacchainProvider(yourRPCNode);
  const signer = new LacchainSigner(
    privateKey,
    provider,
    nodeAddress,
    expiration_date
  );


  console.log(`Create Factory ${contractAbi.contractName}...`);

  const contractFactory = new ethers.ContractFactory(
    contractAbi.abi,
    contractAbi.bytecode,
    signer
  );

  console.log(`Deploying ${contractAbi.contractName}...`);

  const contract = await contractFactory.deploy();
  const receipt = await contract.deploymentTransaction()?.wait();
  console.log("Contract deployed!");
  const contractAddress = receipt?.contractAddress;
  console.log(`${contractAbi.contractName} Contract Address: `, contractAddress );

  deployedContract = new ethers.Contract(contractAddress, contractAbi.abi, provider);

  deployedContractOwner = await deployedContract.getOwner();

  console.log(`${contractAbi.contractName} Owner Address: `,deployedContractOwner)

  geetResponse  = await deployedContract.greetMe('Alice');

  console.log(`${contractAbi.contractName} greetMe('Alice'): `,geetResponse)
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
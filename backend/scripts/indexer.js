const { Web3 } = require("web3");
const mongoose = require("mongoose");
const abi = require("./MyContractAbi.json");
require("dotenv").config();

const url = "https://sepolia.infura.io/v3/7997091568f840f79ae9d88321a8dc1f";
const web3 = new Web3(url);
const contractAddress = "0x6FeBA6d8867d48a43D4bfE20915ea161FBB0F65a";
const myContract = new web3.eth.Contract(abi, contractAddress);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for the InstrSent event
const InstrSentSchema = new mongoose.Schema({
  sender: String,
  instruction: String,
  timestamp: Date,
  blockNumber: Number,
  transactionHash: String,
});

const InstrSent = mongoose.model("InstrSent", InstrSentSchema);

async function indexEvents() {
  const latestBlock = await web3.eth.getBlockNumber();
  let fromBlock = 0; // You might want to store and retrieve this value to avoid reindexing

  console.log(`Indexing events from block ${fromBlock} to ${latestBlock}`);

  const events = await myContract.getPastEvents("InstrSent", {
    fromBlock,
    toBlock: latestBlock,
  });

  for (const event of events) {
    const { sender, instruction } = event.returnValues;
    const { blockNumber, transactionHash } = event;

    await InstrSent.findOneAndUpdate(
      { transactionHash },
      {
        sender,
        instruction,
        timestamp: new Date(),
        blockNumber,
        transactionHash,
      },
      { upsert: true, new: true }
    );
  }

  console.log(`Indexed ${events.length} events`);

  // Listen for new events
  myContract.events.InstrSent({})
    .on("data", async (event) => {
      const { sender, instruction } = event.returnValues;
      const { blockNumber, transactionHash } = event;

      await InstrSent.findOneAndUpdate(
        { transactionHash },
        {
          sender,
          instruction,
          timestamp: new Date(),
          blockNumber,
          transactionHash,
        },
        { upsert: true, new: true }
      );

      console.log(`New InstrSent event indexed: ${transactionHash}`);
    })
    .on("error", console.error);
}

indexEvents().catch(console.error);
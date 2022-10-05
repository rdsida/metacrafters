// Import Solana web3 functinalities
const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction
} = require("@solana/web3.js");

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const getWalletBalance = async (publicKey) => {
  try {
      var walletBalance = await connection.getBalance(publicKey);
      return walletBalance
  } catch (err) {
      console.log(err);
      return  0
  }
};

const logWalletAmount = (publicKey, amount) => {
  console.log(publicKey + ` has: ` + amount/LAMPORTS_PER_SOL + ` SOL`)
}

const airDropSol = async (publicKey, amount) => {
  console.log("Airdopping some SOL to Sender wallet!");
  const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(publicKey),
      amount * LAMPORTS_PER_SOL
  );

  let latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirDropSignature
  });
};

const sendSol = async (from, to, amount) => {
  console.log(`Sending ` + amount/LAMPORTS_PER_SOL + ` SOL`)
  var transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: amount
    })
  );

  var signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [from]
  )
  console.log(`Sending Complete, Signature: ` + signature)
}

const transferHalfOfSol = async() => {
  var from = Keypair.generate();
  var to = Keypair.generate();

  var fromWalletBalance = await getWalletBalance(from.publicKey)
  logWalletAmount(from.publicKey, fromWalletBalance);

  // Airdrop random amount of SOL to Sender wallet
  let numberOfSol = Math.floor(Math.random() * 2)
  await airDropSol(from.publicKey, numberOfSol)

  fromWalletBalance = await getWalletBalance(from.publicKey)
  logWalletAmount(from.publicKey, fromWalletBalance)

  let sending_amount = fromWalletBalance/2
  await sendSol(from, to, sending_amount)

  var toWalletBalance = await getWalletBalance(to.publicKey)
  logWalletAmount(to.publicKey, toWalletBalance)
  logWalletAmount(from.publicKey, toWalletBalance)
}

transferHalfOfSol();

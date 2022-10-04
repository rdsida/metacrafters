import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const getWalletBalance = async () => {
  try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const walletBalance = await connection.getBalance(publicKey);
      console.log(publicKey + ` - balance: ${walletBalance / LAMPORTS_PER_SOL} SOL`);
  } catch (err) {
      console.log(err);
  }
};

const airDropSol = async () => {
  try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      console.log("Airdropping some SOL to my wallet!");
      const fromAirDropSignature = await connection.requestAirdrop(
          publicKey,
          2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(fromAirDropSignature);
  } catch (err) {
      console.log(err);
  }
};

const mainFunction = async () => {
  await getWalletBalance();
  await airDropSol();
  await getWalletBalance();
}

var test = process.argv.slice(2).toString();
if (test != "") {
  var publicKey = new PublicKey(test);
  mainFunction();
} else {
  console.log("Need to specify wallet to which to drop")
}
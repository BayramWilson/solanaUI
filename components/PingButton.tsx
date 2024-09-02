import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from '@solana/web3.js';
import { FC, useState } from 'react';
import styles from '../styles/PingButton.module.css';

const PROGRAM_ID = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa';

export const PingButton: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState<string>(''); // State to hold the amount input
  const [recipient, setRecipient] = useState<string>(''); // State to hold the recipient public key input

  const onClick = async () => {
    if (!connection || !publicKey || !amount || !recipient) {
      console.error('Missing information.');
      return;
    }

    const lamports = web3.LAMPORTS_PER_SOL * parseFloat(amount);

    try {
      const recipientPubKey = new web3.PublicKey(recipient);
      const transaction = new web3.Transaction();

      // Add a transfer instruction for sending SOL to the recipient
      transaction.add(
        web3.SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports: lamports,
        })
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction signature:', signature);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Recipient's Public Key"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.inputContainer}>
        <input
          type="number"
          placeholder="Amount of SOL to send"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
        />
      </div>
      <div className={styles.buttonContainer} onClick={onClick}>
        <button className={styles.button}>Send</button>
      </div>
    </div>
  );
};

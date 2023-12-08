import express from "express";
import dotenv from "dotenv";
import {
  BroadcastMode,
  MsgGrantAllowance,
  MsgRevokeAllowance,
  SecretNetworkClient,
  validateAddress,
  Wallet,
} from "secretjs";
import { Timestamp } from "secretjs/dist/protobuf/google/protobuf/timestamp";
import { QueryAllowanceResponse } from "secretjs/dist/grpc_gateway/cosmos/feegrant/v1beta1/query.pb";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const SECRET_CHAIN_ID = process.env.CHAIN_ID || "secret-4";
const SECRET_LCD = process.env.LCD_NODE || "https://lcd.mainnet.secretsaturn.net";

const secretjs = new SecretNetworkClient({
  url: SECRET_LCD,
  chainId: SECRET_CHAIN_ID,
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/compute/v1beta1/query/:contractAddress", async (req, res) => {
  try {
    const { contractAddress } = req.params;

    const query = req.query.query as string
  
    console.log(contractAddress)
  
    const jsonString = Buffer.from(query, 'base64').toString('utf-8');
  
    const queryObject = JSON.parse(jsonString);
  
    const result = await secretjs?.query?.compute?.queryContract({
      contract_address: contractAddress,
      query: queryObject
    })

    console.log(result)
    return res.json(result);

  } catch (error: any) {
    console.error("Error querying data:", error);
    return res.status(500).send(error.message);
  }
});


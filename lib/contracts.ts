export const ENCRYPTED_TOKEN_FACTORY_ADDRESS = "0x..." as `0x${string}`;

export const ENCRYPTED_TOKEN_FACTORY_ABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "initialSupply", type: "uint256" },
    ],
    name: "deployToken",
    outputs: [{ name: "token", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        name: "transfer",
        type: "tuple",
        components: [
          { name: "to", type: "address" },
          { name: "encryptedAmount", type: "uint256" },
        ],
      },
    ],
    name: "transferEncrypted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

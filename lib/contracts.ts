// Ensure environment variables are defined
if (!process.env.NEXT_PUBLIC_DISCRETE_ERC20_FACTORY_ADDRESS) {
  throw new Error("NEXT_PUBLIC_DISCRETE_ERC20_FACTORY_ADDRESS is not defined");
}

if (!process.env.NEXT_PUBLIC_PAILLIER_ADDRESS) {
  throw new Error("NEXT_PUBLIC_PAILLIER_ADDRESS is not defined");
}

export const DISCRETE_ERC20_FACTORY_ADDRESS = process.env
  .NEXT_PUBLIC_DISCRETE_ERC20_FACTORY_ADDRESS as `0x${string}`;
export const PAILLIER_ADDRESS = process.env
  .NEXT_PUBLIC_PAILLIER_ADDRESS as `0x${string}`;

export const DISCRETE_ERC20_FACTORY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "decimals",
        type: "uint8",
      },
    ],
    name: "TokenCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allTokens",
    outputs: [
      {
        internalType: "contract DiscreteERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "_decimals",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "_initialSupply",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_paillier",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "n",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "g",
            type: "bytes",
          },
        ],
        internalType: "struct PublicKey",
        name: "_publicKey",
        type: "tuple",
      },
    ],
    name: "createDiscreteERC20",
    outputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getToken",
    outputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokensCount",
    outputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isDiscreteERC20Token",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const DISCRETE_ERC20_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "_decimals",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "_initialSupply",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "_paillier",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "n",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "g",
            type: "bytes",
          },
        ],
        internalType: "struct PublicKey",
        name: "_publicKey",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        indexed: false,
        internalType: "struct Ciphertext",
        name: "value",
        type: "tuple",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "RequestBalance",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "iv",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "ephemPublicKey",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "ciphertext",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "mac",
            type: "bytes",
          },
        ],
        indexed: false,
        internalType: "struct Secp256k1Ciphertext",
        name: "balance",
        type: "tuple",
      },
    ],
    name: "ResponseBalance",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        indexed: false,
        internalType: "struct Ciphertext",
        name: "value",
        type: "tuple",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "a",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "b",
        type: "tuple",
      },
    ],
    name: "_add",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "a",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "b",
        type: "tuple",
      },
    ],
    name: "_sub",
    outputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "bytes",
        name: "value",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "bytes",
        name: "value",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "amount",
        type: "tuple",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "amount",
        type: "tuple",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "publicKey",
    outputs: [
      {
        internalType: "bytes",
        name: "n",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "g",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "requestBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "iv",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "ephemPublicKey",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "ciphertext",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "mac",
            type: "bytes",
          },
        ],
        internalType: "struct Secp256k1Ciphertext",
        name: "balance",
        type: "tuple",
      },
    ],
    name: "responseBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "bytes",
        name: "value",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes",
            name: "value",
            type: "bytes",
          },
        ],
        internalType: "struct Ciphertext",
        name: "amount",
        type: "tuple",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "success",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

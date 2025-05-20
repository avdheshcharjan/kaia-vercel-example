export const getTransactionsByAccountExamples = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "What are the transactions for address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e like right now?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Which network are you interested in?",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "kairos",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me check the transactions for address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e in kairos for you.",
                action: "GET_TRANSACTIONS_BY_ACCOUNT",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "The transactions for\n0x742d35Cc6634C0532925a3b844Bc454e4438f44e account\non kairos are:\n1. From: 0x15d9a6b292b97e13c2883e61a389b1d85fba1f20\nTo: 0x742d35cc6634c0532925a3b844bc454e4438f44e\nValue: 1\nType: Ethereum Dynamic Fee\nHash:\n0xb436993f9e6037cd166dafb391b3d43806ce5107bc652bc3c39e54acef23016d\n2. From: 0xa1ee5975cfa2180450aed555ba06ab8108a87d4a\nTo: 0x742d35cc6634c0532925a3b844bc454e4438f44e\nValue: 0.001\nType: Legacy\nHash:\n0x803adbbdeab6d5c9896a37e71a9b7b4a3778f5e137565112d9e3724793d78e8f\n3. From: 0xa1ee5975cfa2180450aed555ba06ab8108a87d4a\nTo: 0x742d35cc6634c0532925a3b844bc454e4438f44e\nValue: 0.001\nType: Legacy\nHash:\n0x0c51713aecd5dd22923bcd6d35f5e2e59a43f966517e4375ccd951e1e01a4cd6"
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What's the list of transactions for address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e on kaia?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "I'll check the address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e for transactions in kaia for you.",
                action: "GET_TRANSACTIONS_BY_ACCOUNT",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "The transactions for\n0x742d35Cc6634C0532925a3b844Bc454e4438f44e account\non kaia are:\n1. From: 0xa1ee5975cfa2180450aed555ba06ab8108a87d4a\nTo: 0x742d35cc6634c0532925a3b844bc454e4438f44e\nValue: 0.001\nType: Legacy\nHash:\n0x6f0fcb80c461a027d60feab7f4bda0674d4018c0a483097d18d0ec78fa47e444\n2. From: 0x15d9a6b292b97e13c2883e61a389b1d85fba1f20\nTo: 0x742d35cc6634c0532925a3b844bc454e4438f44e\nValue: 0.5\nType: Ethereum Dynamic Fee\nHash:\n0xb436993f9e6037cd166dafb391b3d43806ce5107bc652bc3c39e54acef23016d"
            },
        },
    ]
];

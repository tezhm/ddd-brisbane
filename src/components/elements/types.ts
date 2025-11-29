export type Address = `0x${string}`;

export const TransactionState = {
    IDLE: 0,
    WAITING_SIGNATURE: 1,
    PENDING: 2,
    CONFIRMING: 3,
    SUCCESS: 4,
    ERROR: 5,
} as const;

export type TransactionState = typeof TransactionState[keyof typeof TransactionState];

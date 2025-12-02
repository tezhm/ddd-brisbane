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

export interface Option {
    title: string;
    description: string;
}

export interface Poll {
    creator: Address;
    title: string;
    options: Option[];
    isOpen: boolean;
}

import {create} from "zustand";

const useStore = create((set) => ({
    account:'',
    accounts:[],
    balance:'',
    contractAddress:'0x417213E993FA352d287A1AeeFCD3B0E5F053DB97',
    myContract:null,    
    setAccount: (account) => set({ account }),
    setAccounts: (accounts) => set({ accounts }),
    setBalance: (balance) => set({ balance }),
    setContractAddress: (contractAddress) => set({ contractAddress }),
    setMyContract: (myContract) => set({ myContract }),
}));

export default useStore;
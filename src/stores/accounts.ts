import { defineStore } from 'pinia';
import type { Account, AccountType } from '@/types/account';

interface AccountsState {
  accounts: Account[];
}

const STORAGE_KEY = 'accounts';

export const useAccountsStore = defineStore('accounts', {
  state: (): AccountsState => ({
    accounts: [],
  }),

  actions: {
    load() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw) as Account[];
        this.accounts = parsed;
      } catch {
        this.accounts = [];
      }
    },

    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.accounts));
    },

    addEmpty() {
      const id = crypto.randomUUID();
      this.accounts.push({
        id,
        labels: [],
        type: 'Local',
        login: '',
        password: '',
      });
      this.save();
    },

    updatePartial(id: string, patch: Partial<Account>) {
      const idx = this.accounts.findIndex((a) => a.id === id);
      if (idx === -1) return;
      this.accounts[idx] = { ...this.accounts[idx], ...patch };
      this.save();
    },

    setAll(accounts: Account[]) {
      this.accounts = accounts;
      this.save();
    },

    remove(id: string) {
      this.accounts = this.accounts.filter((a) => a.id !== id);
      this.save();
    },

    setType(id: string, type: AccountType) {
      const idx = this.accounts.findIndex((a) => a.id === id);
      if (idx === -1) return;
      const acc = this.accounts[idx];
      const password = type === 'LDAP' ? null : acc.password ?? '';
      this.accounts[idx] = { ...acc, type, password };
      this.save();
    },
  },
});

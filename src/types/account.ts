export type AccountType = 'LDAP' | 'Local';

export interface LabelItem {
  text: string;
}

export interface Account {
  id: string;
  labels: LabelItem[];
  type: AccountType;
  login: string;
  password: string | null;
}

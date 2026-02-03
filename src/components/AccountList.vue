<script setup lang="ts">
import { onMounted } from 'vue';
import { ElButton } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useAccountsStore } from '@/stores/accounts';
import AccountRow from './AccountRow.vue';

const store = useAccountsStore();

onMounted(() => {
  store.load();
  if (!store.accounts.length) {
    store.addEmpty();
  }
});

function addAccount() {
  store.addEmpty();
}

function removeAccount(id: string) {
  store.remove(id);
}
</script>

<template>
  <div>
    <div class="app-header">
      <div class="app-title">Учетные записи</div>
      <ElButton
        type="primary"
        size="small"
        @click="addAccount"
      >
        <Plus style="margin-right: 4px" />
        Добавить
      </ElButton>
    </div>

    <div class="app-hint">
      Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
    </div>

    <div class="accounts-table-header">
      <div>Метки</div>
      <div>Тип записи</div>
      <div>Логин</div>
      <div>Пароль</div>
      <div></div>
    </div>

    <div>
      <AccountRow
        v-for="acc in store.accounts"
        :key="acc.id"
        :account="acc"
        @remove="removeAccount"
      />
    </div>
  </div>
</template>

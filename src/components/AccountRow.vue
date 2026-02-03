<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { ElInput, ElSelect, ElOption, ElButton, ElIcon } from 'element-plus';
import { View, Hide, Delete } from '@element-plus/icons-vue';
import type { Account, AccountType } from '@/types/account';
import { parseLabels, labelsToString } from '@/utils/labels';
import { useAccountsStore } from '@/stores/accounts';

const props = defineProps<{
  account: Account;
}>();

const emit = defineEmits<{
  (e: 'remove', id: string): void;
}>();

const store = useAccountsStore();

const form = reactive({
  labelsText: labelsToString(props.account.labels),
  type: props.account.type as AccountType,
  login: props.account.login,
  password: props.account.password ?? '',
});

const errors = reactive({
  labels: false,
  login: false,
  password: false,
});

const showPassword = reactive({ value: false });

watch(
  () => props.account,
  (acc) => {
    form.labelsText = labelsToString(acc.labels);
    form.type = acc.type;
    form.login = acc.login;
    form.password = acc.password ?? '';
  },
  { deep: true }
);

const isLocal = computed(() => form.type === 'Local');

function validateLabels(): boolean {
  errors.labels = false;
  if (!form.labelsText.trim()) return true;
  const parts = form.labelsText.split(';').map((s) => s.trim()).filter(Boolean);
  for (const p of parts) {
    if (p.length > 50) {
      errors.labels = true;
      break;
    }
  }
  return !errors.labels;
}

function validateLogin(): boolean {
  errors.login = false;
  if (!form.login.trim()) {
    errors.login = true;
    return false;
  }
  if (form.login.length > 100) {
    errors.login = true;
    return false;
  }
  return true;
}

function validatePassword(): boolean {
  errors.password = false;
  if (!isLocal.value) return true;
  if (!form.password.trim()) {
    errors.password = true;
    return false;
  }
  if (form.password.length > 100) {
    errors.password = true;
    return false;
  }
  return true;
}

function validateAll(): boolean {
  return validateLabels() && validateLogin() && validatePassword();
}

function saveIfValid() {
  if (!validateAll()) return;
  const labels = parseLabels(form.labelsText);
  const password = isLocal.value ? form.password : null;

  store.updatePartial(props.account.id, {
    labels,
    type: form.type,
    login: form.login.trim(),
    password,
  });
}

function onTypeChange(value: AccountType) {
  form.type = value;

  if (!isLocal.value) {
    form.password = '';
  }

  store.setType(props.account.id, value);
  validatePassword();
  saveIfValid();
}

function onRemove() {
  emit('remove', props.account.id);
}
</script>

<template>
  <div class="account-row">
    <!-- Метки -->
    <div :class="['field', { 'field-error': errors.labels }]">
      <ElInput
        v-model="form.labelsText"
        placeholder="Метки"
        size="small"
        @blur="() => { validateLabels(); saveIfValid(); }"
      />
    </div>

    <!-- Тип записи -->
    <div>
      <ElSelect
        v-model="form.type"
        size="small"
        @change="onTypeChange"
      >
        <ElOption label="LDAP" value="LDAP" />
        <ElOption label="Локальная" value="Local" />
      </ElSelect>
    </div>

    <!-- Логин -->
    <div :class="['field', { 'field-error': errors.login }]">
      <ElInput
        v-model="form.login"
        placeholder="Логин"
        size="small"
        @blur="() => { validateLogin(); saveIfValid(); }"
      />
    </div>

    <!-- Пароль -->
    <div v-if="isLocal" :class="['field', { 'field-error': errors.password }]">
      <div class="password-input-with-toggle">
        <ElInput
          v-model="form.password"
          :type="showPassword.value ? 'text' : 'password'"
          placeholder="Пароль"
          size="small"
          @blur="() => { validatePassword(); saveIfValid(); }"
        />
        <ElButton
          text
          size="small"
          @click="showPassword.value = !showPassword.value"
        >
          <ElIcon>
            <component :is="showPassword.value ? Hide : View" />
          </ElIcon>
        </ElButton>
      </div>
    </div>
    <div v-else></div>

    <!-- Удаление -->
    <div class="account-row-delete">
      <ElButton
        type="danger"
        text
        size="small"
        @click="onRemove"
      >
        <ElIcon><Delete /></ElIcon>
      </ElButton>
    </div>
  </div>
</template>

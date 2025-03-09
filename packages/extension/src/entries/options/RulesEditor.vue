<template>
  <div class="flex flex-col shrink gap-lg">
    <div class="flex flex-row items-center">
      <input type="text" /> <span>Filter Rules</span>
    </div>
    <div class="flex flex-col min-w-[560px] border-b border-brand-gray">
      <div v-for="rule of rules" :key="rule.rule_id"
        class="flex flex-row items-center gap-2lg justify-between border-t border-brand-gray">
        <div class="flex flex-col items-start">
          <span>{{ rule.title }}</span>
          <span>{{ rule.url }}</span>
        </div>
        <div class="flex flex-row items-center gap-md">
          <button class="button-edit" @click="$emit('edit', rule)" title="Edit">
            <Edit width="1.2em" height="1.2em" />
          </button>
          <button class="button-delete" @click="deleteRule(rule.rule_id)" title="Delete">
            <Delete width="1.2em" height="1.2em" />
          </button>
          <button @click="toggleRule(rule.rule_id)" title="Toggle">
            <img :src="rule.is_disabled ? offUrl : onUrl" class="w-[2.5em] h-[1em]" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RULES_STORAGE_KEY, useBrowserStorage } from "~/utils";
import type { Rule } from "~/services/types";
import Edit from '~/components/img/Edit.vue';
import Delete from '~/components/img/Delete.vue';
import OnIcon from '~/assets/on.png';
import OffIcon from '~/assets/off.png';
import { sendMessageToBackground } from "deco-ext";

const onUrl = new URL(OnIcon, import.meta.url).href;
const offUrl = new URL(OffIcon, import.meta.url).href;

const { value: rules } = useBrowserStorage<Rule[]>(RULES_STORAGE_KEY, [])

const toggleRule = async (id: number) => {
  // TODO: Implement rule editing logic
  await sendMessageToBackground('toggleRule', { id })
}

const deleteRule = (id: number) => {
  sendMessageToBackground('deleteRule', { id })
}
</script>

<script setup lang="ts">
interface Props {
  modelValue: string
  placeholder?: string
  label?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]  
}>()

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="props.label" class="text-sm font-medium text-gray-700">
      {{ props.label }}
    </label>
    <input
      type="text"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      @input="onInput"
      class="w-full px-4 py-2.5 
          border border-gray-300 rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500 
          focus:border-transparent 
          transition-all duration-300
        placeholder-gray-400 hover:border-gray-400"
    />
  </div>
</template>
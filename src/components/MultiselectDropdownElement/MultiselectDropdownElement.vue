<template>
  <div
    @mousemove="toggleActiveIndex(index)"
    class="mutliselect__dropdown-element"
    :class="{ 'mutliselect__dropdown-element_active': isActive }"
    @click="
      () => {
        toggleSelection(element.value)
        toggleActiveIndex(index)
      }
    "
  >
    <div v-if="multiple" class="mutliselect__dropdown-element-checkbox">
      <input type="checkbox" :checked="value.includes(element.value)" />
    </div>
    <div class="mutliselect__dropdown-element-title">
      {{ element.label }}
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { InjectionKeyToggleSelection, InjectionKeyToggleActiveIndex } from '../../keys.js'
const toggleSelection = inject(InjectionKeyToggleSelection)
const toggleActiveIndex = inject(InjectionKeyToggleActiveIndex)

const { element, value, isActive } = defineProps({
  element: {
    type: [Object, Array, String, Number, null],
    default: () => []
  },
  value: {
    type: [Object, Array, String, Number, null],
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 12
  }
})
</script>

<style lang="scss" scoped>
.mutliselect__dropdown-element {
  display: flex;
  cursor: pointer;
  font-size: 12px;
  align-items: center;
  padding: 8px 0;
}

.mutliselect__dropdown-element_active {
  background-color: #f0f5fc;
}
.mutliselect__dropdown-element-checkbox {
  margin-left: 14px;
  color: #2693ff;
}
.mutliselect__dropdown-element-title {
  margin-left: 8px;
  color: #555d6c;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  // line-height: 12px;
}
</style>

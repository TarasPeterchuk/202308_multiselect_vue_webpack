<template>
  <div
    :class="{
      'muttiselect__chip_hidden-chip': index >= maxVisibleChips
    }"
    class="mutliselect__chip"
    @click="
      (event) => {
        event.stopPropagation()
      }
    "
  >
    <span class="mutliselect__chip-text">{{ item.label }} </span>
    <svg
      v-if="multiple"
      @click="toggleSelection(item.value)"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M5.99987 5.29336L8.47487 2.81836L9.18187 3.52536L6.70687 6.00036L9.18187 8.47536L8.47487 9.18236L5.99987 6.70736L3.52487 9.18236L2.81787 8.47536L5.29287 6.00036L2.81787 3.52536L3.52487 2.81836L5.99987 5.29336Z"
        fill="#2693FF"
      />
    </svg>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import { InjectionKeyToggleSelection } from '../keys.js'
const toggleSelection = inject(InjectionKeyToggleSelection)
const { item, index, maxVisibleChips, multiple } = defineProps({
  item: {
    type: [Object, Array, String, Number, null],
    default: null
  },
  maxVisibleChips: {
    type: [Number, null],
    default: Number
  },
  index: {
    type: [Number],
    default: Number
  },
  multiple: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.mutliselect__chip {
  padding: 4px 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  color: #2693ff;
  border-radius: 2px;
  background: rgba(38, 147, 255, 0.3);
}

.muttiselect__chip_hidden-chip {
  display: none;
}

.mutliselect__chip-text {
  white-space: nowrap;
  color: #2693ff;
  font-family: Inter;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
</style>

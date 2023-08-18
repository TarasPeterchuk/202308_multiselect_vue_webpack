<template>
  <div class="mutliselect__dropdown">
    <MultiselectDropdownElement
      v-for="(element, index) in optionElementsSearch"
      :key="element.label"
      :element="element"
      :value="value"
      :index="index"
      :multiple="multiple"
      :isActive="index === activeIndex"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, inject, provide, watch } from 'vue'
import { InjectionKeyToggleSelection, InjectionKeyToggleActiveIndex } from '../../keys.js'
import MultiselectDropdownElement from '../MultiselectDropdownElement/MultiselectDropdownElement.vue'
const toggleSelection = inject(InjectionKeyToggleSelection)

const { multiple, optionElementsSearch, value } = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  value: {
    type: [Object, Array, String, Number, null],
    default: () => []
  },
  optionElementsSearch: {
    type: [Object, Array, String, Number, null],
    default: () => []
  }
})

const activeIndex = ref(-1)
watch(optionElementsSearch, (newValue, oldValue) => {
  console.log('optionElementsSearch changed:', newValue, oldValue)
})

const handleKeyPress = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (activeIndex.value <= optionElementsSearch.length - 1) {
        activeIndex.value++
      }
      if (activeIndex.value === optionElementsSearch.length) {
        activeIndex.value = 0
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (activeIndex.value >= 0) {
        activeIndex.value--
      }
      if (activeIndex.value === -1) {
        activeIndex.value = optionElementsSearch.length - 1
      }
      break
    case 'Enter':
    case ' ':
      event.preventDefault()
      if (activeIndex.value >= 0 && activeIndex.value < optionElementsSearch.length) {
        toggleSelection(optionElementsSearch[activeIndex.value].value)
      }
      break
  }
}
onMounted(() => {
  document.addEventListener('keydown', handleKeyPress)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyPress)
})

const toggleActiveIndex = (value) => {
  activeIndex.value = value
}
provide(InjectionKeyToggleActiveIndex, toggleActiveIndex)
</script>

<style lang="scss" scoped>
.mutliselect__dropdown {
  position: absolute;
  max-height: 50vh;
  z-index: 1;
  width: 100%;
  padding: 8px 0;
  border-radius: 0px 0px 7px 7px;
  border: 1px solid #e8e8e8;
  background: #fff;
  overflow-y: auto;
  outline: none;
}
</style>

<template>
  <div class="mutliselect__dropdown">
    <div v-if="search" class="mutliselect__search">
      <input
        ref="inputSearchRef"
        v-model="searchValue"
        class="mutliselect__search-input"
        @input="handleSearchChange(searchValue)"
        placeholder="search"
      />
    </div>
    <MultiselectDropdownElement
      v-for="(element, index) in props.optionElementsSearch"
      :key="element.label"
      :element="element"
      :value="value"
      :index="index"
      :multiple="multiple"
      :isActive="index === activeIndex"
      :hideSelected="hideSelected"
    />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, inject, provide, watch } from 'vue'
import {
  InjectionKeyToggleSelection,
  InjectionKeyToggleActiveIndex,
  InjectionKeyCloseDropdown,
  InjectionKeyHandleSearchChange
} from '../keys.js'
import MultiselectDropdownElement from './MultiselectDropdownElement.vue'

const toggleSelection = inject(InjectionKeyToggleSelection)
const closeDropdown = inject(InjectionKeyCloseDropdown)
const handleSearchChange = inject(InjectionKeyHandleSearchChange)

const props = defineProps({
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
  },
  hideSelected: {
    type: Boolean,
    default: true
  },
  search: {
    type: Boolean,
    default: false
  },
  searchValueProp: { type: String, default: 'la' }
})

const inputSearchRef = ref(null)
const searchValue = props.searchValueProp

const activeIndex = ref(-1)

watch(
  () => props.optionElementsSearch,
  () => {
    activeIndex.value = -1
  }
)

const handleKeyPress = (event) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (activeIndex.value <= props.optionElementsSearch.length - 1) {
        activeIndex.value++
      }
      if (activeIndex.value === props.optionElementsSearch.length) {
        activeIndex.value = 0
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (activeIndex.value >= 0) {
        activeIndex.value--
      }
      if (activeIndex.value === -1) {
        activeIndex.value = props.optionElementsSearch.length - 1
      }
      break
    case 'Enter':
      event.preventDefault()
      if (activeIndex.value >= 0 && activeIndex.value < props.optionElementsSearch.length) {
        toggleSelection(props.optionElementsSearch[activeIndex.value].value)
      }
      break
    case 'Escape':
      event.preventDefault()
      closeDropdown()
      break
  }
}
onMounted(() => {
  inputSearchRef.value.focus()
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
.mutliselect__search {
  display: flex;
}
.mutliselect__search-input {
  border: 1px solid #bdbecd;
  border-radius: 2px;
  color: #555d6c;
  &:focus {
    outline: none !important;
    border: 1px solid #bdbecd;
    border-radius: 2px;
    box-shadow: 0 0 5px #555d6c;
  }
}
</style>

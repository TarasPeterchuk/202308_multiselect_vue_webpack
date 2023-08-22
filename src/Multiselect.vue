<template>
  <div class="multiselect">
    <MultiselectField
      :selectedItems="selectedItems"
      :maxVisibleChips="maxVisibleChips"
      :placeholder="placeholder"
      :showDropdown="showDropdown"
      :search="search"
      :multiple="multiple"
      :tags="tags"
      :disabled="disabled"
    />
    <MultiselectDropdown
      v-if="showDropdown"
      :multiple="multiple"
      :optionElementsSearch="optionElementsSearch"
      :value="value"
      :hideSelected="hideSelected"
    />
  </div>
</template>

<script setup>
import { provide, ref, watch, onMounted, onUnmounted, onUpdated } from 'vue'
import MultiselectField from './components/MultiselectField.vue'
import MultiselectDropdown from './components/MultiselectDropdown.vue'
import {
  InjectionKeyToggleSelection,
  InjectionKeyClearSelection,
  InjectionKeyToggleDropdown,
  InjectionKeyCloseDropdown,
  InjectionKeyHandleSearchChange
} from './keys.js'

const props = defineProps({
  value: {
    type: [Object, Array, String, Number, null],
    default: null
  },
  modelValue: {
    type: [Object, Array, String, Number, null],
    default: null
  },
  multiple: {
    type: Boolean,
    default: false
  },
  tags: {
    type: Boolean,
    default: true
  },
  object: {
    type: Boolean,
    default: false
  },
  labelProp: {
    type: String,
    default: 'label'
  },
  valueProp: {
    type: String,
    default: 'id'
  },
  search: {
    type: Boolean,
    default: false
  },
  searchBy: {
    type: String,
    default: 'label'
  },
  hideSelected: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  default: {
    type: Array,
    default: () => []
  },
  label: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  items: {
    type: [Object, Array],
    default: () => ({})
  }
})

let value = props.modelValue ? props.modelValue : props.value
const showDropdown = ref(false)

const labels = props.object
  ? props.items.map((el) => el[props.labelProp].toString())
  : props.items.map((el) => el.toString())
const values = props.object ? props.items.map((el) => el[props.valueProp]) : props.items
const itemsArray = labels.map((el, index) => ({
  label: el,
  value: values[index]
}))

const optionElements = labels.map((el, i) => ({ label: el, value: values[i] }))
// .filter((el) => (props.hideSelected ? false : !value.includes(el.value)))

const optionElementsSearch = ref(optionElements)

const maxVisibleChips = ref(5)

const selectedItemsFunc = (value) =>
  props.multiple
    ? value.map((el) => ({
        label: itemsArray.find((element) => element.value === el).label,
        value: el
      }))
    : [
        {
          label: itemsArray.find((element) => element.value === value).label,
          value: value
        }
      ]

const selectedItems = ref(selectedItemsFunc(value))

function getTextWidth(text, font) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}

const setVisibleChips = () => {
  const chipsContainer = document.querySelector('.muttiselect__chips')
  const chipsWidth = chipsContainer.offsetWidth
  const fieldContainer = document.querySelector('.multiselect__field-items')
  const fieldWidth = fieldContainer.offsetWidth
  const plusOneLength =
    maxVisibleChips.value === selectedItems.value.length - 1
      ? getTextWidth('і ще 1', '500 10px Inter') + 2
      : 0
  if (chipsWidth >= fieldWidth && maxVisibleChips.value > 1) {
    maxVisibleChips.value -= 1
  } else if (
    selectedItems.value[maxVisibleChips.value] &&
    chipsWidth +
      getTextWidth(selectedItems.value[maxVisibleChips.value].label, '500 10px Inter') -
      plusOneLength +
      34 <=
      fieldWidth &&
    selectedItems.value.length >= maxVisibleChips.value
  ) {
    // 34 is a number of margings and paddings of chip plus gap sizes
    maxVisibleChips.value += 1
  }
}

onUpdated(() => {
  if (props.tags) {
    setVisibleChips()
  }
})

watch(
  () => props.value,
  (newValue) => {
    value = newValue
    selectedItems.value = selectedItemsFunc(newValue)
  }
)

watch(
  () => props.modelValue,
  (newValue) => {
    value = newValue
    selectedItems.value = selectedItemsFunc(newValue)
  }
)

const emit = defineEmits(['update:modelValue', 'select', 'change', 'search-change', 'deselect'])

const handleSearchChange = (searchValue) => {
  emit('search-change')
  optionElementsSearch.value = optionElements.filter((el) =>
    el.label.toLowerCase().includes(searchValue.toLowerCase())
  )
}
provide(InjectionKeyHandleSearchChange, handleSearchChange)

const toggleDropdown = (event) => {
  if (!props.disabled) {
    const input = document.querySelector('.mutliselect__search')
    if (input && showDropdown.value === true && input.contains(event.target)) {
      return
    }
    showDropdown.value = !showDropdown.value
  }
}
const closeDropdown = () => {
  showDropdown.value = false
}
provide(InjectionKeyCloseDropdown, closeDropdown)

provide(InjectionKeyToggleDropdown, toggleDropdown)

const handleClickOutsideDropdown = (event) => {
  const dropdown = document.querySelector('.mutliselect__dropdown')

  if (dropdown && !dropdown.contains(event.target)) {
    showDropdown.value = false
  }
}

const toggleSelection = (item) => {
  if (props.disabled) {
    return
  }
  let newValue = props.multiple ? [] : null
  if (!props.multiple) {
    emit('update:modelValue', item)
    emit('select', item)
    emit('change', item, value)
    showDropdown.value = false
  } else {
    if (!value.includes(item)) {
      newValue = [...value, item]
      emit('select', item)
    } else {
      newValue = value.filter((el) => el !== item)
      emit('deselect', item)
    }
    emit('update:modelValue', newValue)
    emit('change', newValue, value)
  }
}

provide(InjectionKeyToggleSelection, toggleSelection)

const clearSelection = (event) => {
  if (props.disabled) {
    return
  }
  event.stopPropagation()
  emit('update:modelValue', props.multiple ? [] : '')
}
provide(InjectionKeyClearSelection, clearSelection)

onMounted(() => {
  document.addEventListener('click', handleClickOutsideDropdown)
  const multiselect = document.querySelector('.multiselect')
  if (multiselect) {
    resizeObserver.observe(multiselect)
  }
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideDropdown)
  resizeObserver.disconnect()
})

const handleResize = (entries) => {
  for (const entry of entries) {
    if (entry.target.classList.contains('multiselect') && props.tags) {
      setVisibleChips()
    }
  }
}
const resizeObserver = new ResizeObserver(handleResize)
</script>

<style lang="scss" scoped>
.multiselect {
  font-family: Inter;
  position: relative;
  min-width: 250px;
}
</style>

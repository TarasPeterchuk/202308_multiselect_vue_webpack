<template>
  <div class="multiselect">
    <MultiselectField
      :selectedItems="selectedItems"
      :maxVisibleChips="maxVisibleChips"
      :placeholder="placeholder"
      :showDropdown="showDropdown"
      :search="search"
    />
    <MultiselectDropdown
      v-if="showDropdown"
      :multiple="multiple"
      :optionElementsSearch="optionElementsSearch"
      :value="value"
    />
  </div>
</template>

<script setup>
import { provide, ref, watch, onMounted, onUnmounted, onUpdated } from 'vue'
import MultiselectField from '../MultiselectField/MultiselectField.vue'
import MultiselectDropdown from '../MultiselectDropdown/MultiselectDropdown.vue'
import {
  InjectionKeyToggleSelection,
  InjectionKeyClearSelection,
  InjectionKeyToggleDropdown
} from '../../keys.js'

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
    default: true
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
const searchValue = ref('')

const labels = props.object ? props.items.map((el) => el[props.labelProp]) : props.items
const values = props.object ? props.items.map((el) => el[props.valueProp]) : props.items
const itemsArray = labels.map((el, index) => ({
  label: el,
  value: values[index]
}))

const optionElements = labels
  .map((el, i) => ({ label: el, value: values[i] }))
  .filter((el) => (props.hideSelected ? !value.includes(el.value) : true))

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

const setVisibleChips = () => {
  const chipsContainer = document.querySelector('.muttiselect__chips')
  const chipsWidth = chipsContainer.offsetWidth
  const fieldContainer = document.querySelector('.multiselect__field-items')
  const fieldWidth = fieldContainer.offsetWidth
  if (chipsWidth + 50 > fieldWidth && maxVisibleChips.value > 1) {
    maxVisibleChips.value -= 1
  } else if (
    chipsWidth + 220 <= fieldWidth &&
    selectedItems.value.length >= maxVisibleChips.value
  ) {
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

const handleSearchChange = () => {
  emit('search-change')
  optionElementsSearch.value = optionElements.filter((el) =>
    el.label.toLowerCase().includes(searchValue.value.toLowerCase())
  )
}

const toggleDropdown = () => {
  if (!props.disabled) {
    showDropdown.value = !showDropdown.value
  }
}

provide(InjectionKeyToggleDropdown, toggleDropdown)

const handleClickOutsideDropdown = (event) => {
  const dropdown = document.querySelector('.mutliselect__dropdown')
  if (dropdown && !dropdown.contains(event.target)) {
    showDropdown.value = false
  }
}

const toggleSelection = (item) => {
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
  event.stopPropagation()
  emit('update:modelValue', props.multiple ? [] : null)
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

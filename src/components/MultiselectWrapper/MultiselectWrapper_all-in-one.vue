<template>
  <div class="muttiselect">
    <div @click.stop="toggleDropdown" class="muttiselect__element">
      <div class="multiselect__field">
        <span
          v-if="placeholder && !selectedItems.length"
          class="mutliselect__selection-text"
          >{{ placeholder }}</span
        >
        <!---->
        <div v-if="tags" class="muttiselect__chips">
          <div
            v-for="(item, index) in selectedItems"
            :key="item"
            :class="{
              'muttiselect__chip_hidden-chip': index >= maxVisibleChips,
            }"
            class="mutliselect__chip"
            @click="
              (event) => {
                event.stopPropagation();
              }
            "
          >
            <span class="mutliselect__chip-text">{{ item.label }} </span>
            <svg
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
          <span
            v-if="maxVisibleChips < selectedItems.length"
            class="muttiselect__chips-counter"
            >{{
              `і ще 
          ${selectedItems.length - maxVisibleChips}`
            }}</span
          >
        </div>
        <span v-else>{{
          selectedItems.length
            ? selectedItems.reduce(
                (acc, el) => (acc === '' ? el.label : acc + ', ' + el.label),
                ''
              )
            : ''
        }}</span>
        <!---->
      </div>
      <div class="mutliselect__clear" @click="clearSelection">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M10.0001 8.82129L14.1251 4.69629L15.3034 5.87462L11.1784 9.99962L15.3034 14.1246L14.1251 15.303L10.0001 11.178L5.87511 15.303L4.69678 14.1246L8.82178 9.99962L4.69678 5.87462L5.87511 4.69629L10.0001 8.82129Z"
            fill="#E8E8E8"
          />
        </svg>
      </div>
      <div class="mutliselect__append">
        <svg
          v-if="!showDropdown"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M11.9998 12.172L9.17184 9.343L7.75684 10.757L11.9998 15L16.2428 10.757L14.8278 9.343L11.9998 12.172Z"
            fill="#E8E8E8"
          />
        </svg>
        <!-- <svg
          v-if="showDropdown"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"
          />
        </svg> -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M11.9998 11.828L9.17184 14.657L7.75684 13.243L11.9998 9L16.2428 13.243L14.8278 14.657L11.9998 11.828Z"
            fill="#E8E8E8"
          />
        </svg>
      </div>
    </div>
    <div v-if="showDropdown" class="mutliselect__dropdown">
      <div v-if="search" class="mutliselect__dropdown-input">
        <input v-model="searchValue" @input="handleSearchChange" />
      </div>
      <div
        v-for="element in optionElementsSearch"
        :key="element.label"
        class="mutliselect__dropdown-element"
        @click="toggleSelection(element.value)"
      >
        <div v-if="multiple" class="mutliselect__dropdown-element-checkbox">
          <input type="checkbox" :checked="value.includes(element.value)" />
        </div>
        <div class="mutliselect__dropdown-element-title">
          {{ element.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, onUpdated } from 'vue';
import './multiselect.scss';
const props = defineProps({
  value: {
    type: [Object, Array, String, Number, null],
    default: null,
  },
  modelValue: {
    type: [Object, Array, String, Number, null],
    default: null,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  tags: {
    type: Boolean,
    default: true,
  },
  object: {
    type: Boolean,
    default: true,
  },
  labelProp: {
    type: String,
    default: 'label',
  },
  valueProp: {
    type: String,
    default: 'id',
  },
  search: {
    type: Boolean,
    default: false,
  },
  searchBy: {
    type: String,
    default: 'label',
  },
  hideSelected: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  default: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
  items: {
    type: [Object, Array],
    default: () => ({}),
  },
});

let value = props.modelValue ? props.modelValue : props.value;
const showDropdown = ref(false);
const searchValue = ref('');

const labels = props.object
  ? props.items.map((el) => el[props.labelProp])
  : props.items;
const values = props.object
  ? props.items.map((el) => el[props.valueProp])
  : props.items;
const itemsArray = labels.map((el, index) => ({
  label: el,
  value: values[index],
}));

const optionElements = labels
  .map((el, i) => ({ label: el, value: values[i] }))
  .filter((el) => (props.hideSelected ? !value.includes(el.value) : true));

const optionElementsSearch = ref(optionElements);
const maxVisibleChips = ref(5);

const selectedItemsFunc = (value) =>
  props.multiple
    ? value.map((el) => ({
        label: itemsArray.find((element) => element.value === el).label,
        value: el,
      }))
    : [
        {
          label: itemsArray.find((element) => element.value === value).label,
          value: value,
        },
      ];

const selectedItems = ref(selectedItemsFunc(value));

const setVisibleChips = () => {
  const chipsContainer = document.querySelector('.muttiselect__chips');
  const chipsWidth = chipsContainer.offsetWidth;
  const fieldContainer = document.querySelector('.multiselect__field');
  const fieldWidth = fieldContainer.offsetWidth;
  console.log(chipsWidth, fieldWidth);
  if (chipsWidth + 50 > fieldWidth && maxVisibleChips.value > 1) {
    maxVisibleChips.value -= 1;
  } else if (
    chipsWidth + 220 <= fieldWidth &&
    selectedItems.value.length >= maxVisibleChips.value
  ) {
    maxVisibleChips.value += 1;
  }
};

const handleWindowResize = () => {
  if (props.tags) {
    setVisibleChips();
  }
};

onUpdated(() => {
  if (props.tags) {
    setVisibleChips();
  }
});

watch(
  () => props.value,
  (newValue) => {
    value = newValue;
    selectedItems.value = selectedItemsFunc(newValue);
  }
);

watch(
  () => props.modelValue,
  (newValue) => {
    value = newValue;
    selectedItems.value = selectedItemsFunc(newValue);
  }
);

const emit = defineEmits([
  'update:modelValue',
  'select',
  'change',
  'search-change',
  'deselect',
]);

const handleSearchChange = () => {
  emit('search-change');
  optionElementsSearch.value = optionElements.filter((el) =>
    el.label.toLowerCase().includes(searchValue.value.toLowerCase())
  );
};

const toggleDropdown = () => {
  if (!props.disabled) {
    showDropdown.value = !showDropdown.value;
  }
};

const handleClickOutsideDropdown = (event) => {
  const dropdown = document.querySelector('.mutliselect__dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    showDropdown.value = false;
  }
};

const toggleSelection = (item) => {
  let newValue = props.multiple ? [] : null;
  if (!props.multiple) {
    emit('update:modelValue', item);
    emit('select', item);
    emit('change', item, value);
    showDropdown.value = false;
  } else {
    if (!value.includes(item)) {
      newValue = [...value, item];
      emit('select', item);
    } else {
      newValue = value.filter((el) => el !== item);
      emit('deselect', item);
    }
    emit('update:modelValue', newValue);
    emit('change', newValue, value);
  }
};
const clearSelection = (event) => {
  event.stopPropagation();
  emit('update:modelValue', props.multiple ? [] : null);
};

onMounted(() => {
  document.addEventListener('click', handleClickOutsideDropdown);
  window.addEventListener('resize', handleWindowResize);
});
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideDropdown);
  window.addEventListener('resize', handleWindowResize);
});
</script>

<style></style>

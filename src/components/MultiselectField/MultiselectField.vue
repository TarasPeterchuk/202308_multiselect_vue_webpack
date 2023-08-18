<template>
  <div @click.stop="toggleDropdown" class="multiselect__field">
    <div class="multiselect__field-items">
      <span v-if="placeholder && !selectedItems.length" class="mutliselect__selection-text">{{
        placeholder
      }}</span>
      <div v-if="tags" class="muttiselect__chips">
        <MultiselectFieldChip
          v-for="(item, index) in selectedItems"
          :key="item"
          :item="item"
          :index="index"
          :maxVisibleChips="maxVisibleChips"
        />

        <span v-if="maxVisibleChips < selectedItems.length" class="muttiselect__chips-counter">{{
          `і ще 
          ${selectedItems.length - maxVisibleChips}`
        }}</span>
      </div>
      <span v-else>{{
        selectedItems.length
          ? selectedItems.reduce((acc, el) => (acc === '' ? el.label : acc + ', ' + el.label), '')
          : ''
      }}</span>
    </div>
    <div v-if="search" class="mutliselect__search">
      <input v-model="searchValue" @input="handleSearchChange" />
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
</template>

<script setup>
import { inject, ref } from 'vue'
import { InjectionKeyClearSelection, InjectionKeyToggleDropdown } from '../../keys.js'
const clearSelection = inject(InjectionKeyClearSelection)
const toggleDropdown = inject(InjectionKeyToggleDropdown)
import MultiselectFieldChip from '../MultiselectFieldChip/MultiselectFieldChip.vue'

const searchValue = ref('')

const { selectedItems, maxVisibleChips, placeholder, tags, showDropdown } = defineProps({
  selectedItems: {
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
  placeholder: {
    type: String,
    default: null
  },
  tags: {
    type: Boolean,
    default: true
  },
  showDropdown: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
.multiselect__field {
  background-color: #ffffff;
  min-height: 35px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.multiselect__field-items {
  display: flex;
  width: 100%;
  margin: 10px;
}

.multiselect__label {
  position: absolute;
  top: -8px;
  left: 20px;
  font-size: 10px;
  line-height: 10px;
  padding: 0 10px;
  border: 1px #3a354199 solid;
  background-color: #f4f4f4;
  border-radius: 2px;
}

.mutliselect__selection {
  margin-right: 2px;
}

.mutliselect__selection-text {
  margin-left: 16px;
  color: #bdbecd;
  font-feature-settings:
    'clig' off,
    'liga' off;
  font-family: Inter;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}

.muttiselect__chips {
  display: flex;
  gap: 7px;
}
.muttiselect__chips-counter {
  align-items: center;
  display: flex;
  white-space: nowrap;
  color: #bdbecd;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
}
.mutliselect__append {
  display: flex;
  // margin-left: auto;
  margin-right: 4px;
}

.mutliselect__clear {
  display: flex;
  // margin-left: auto;
  margin-right: 4px;
}
</style>

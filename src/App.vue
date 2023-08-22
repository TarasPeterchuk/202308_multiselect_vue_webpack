<template>
  <div class="wrapper">
    <div class="element">
      <MultiSelect
        :items="itemsObjects"
        v-model="value"
        :tags="true"
        multiple
        search
        :disabled="false"
        placeholder="Назва форми"
        :object="true"
        :hideSelected="false"
        labelProp="name"
        @select="handleSelect"
        @deselect="handleDeselect"
        @search-change="handleSearchChange"
        @change="handleChange"
      />
    </div>
    <div class="element">
      <MultiSelect
        search
        :items="itemsArray"
        v-model="valueItem"
        :tags="false"
        :disabled="false"
        placeholder="Назва форми"
        :hideSelected="false"
        @select="handleSelect"
        @deselect="handleDeselect"
        @search-change="handleSearchChange"
        @change="handleChange"
      />
    </div>
    <!-- 
      label="-label-"
      search
      v-model : 
        v-model="value"
      or value:
        :value="value"
        @update:modelValue="value = $event"
     -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MultiSelect from './Multiselect.vue'

const itemsArray = [1, '2', 3]
const itemsObjects = [
  { id: '1', name: 'Client need identification' },
  { id: '2', name: 'Closed - Not Converted' },
  { id: '3', name: 'Label 3' },
  { id: '4', name: 'Label 4 some text' },
  { id: '5', name: 'Label 5 some text' },
  { id: '6', name: 'Label 6 some text' }
]

const value = ref(['1', '2', '6'])
const valueItem = ref('2')

const handleSelect = (option) => {
  console.log(`event select: ${option}`)
}
const handleDeselect = (option) => {
  console.log(`event deselect: ${option}`)
}
const handleSearchChange = () => {
  console.log('event search-change')
}
const handleChange = (newValue, oldValue) => {
  console.log(`event change: new:${newValue}, old:${oldValue}`)
}
</script>
<style>
.wrapper {
  /* display: flex; */
}
</style>

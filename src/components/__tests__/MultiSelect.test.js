// function sum(a, b) {
//   return a + b
// }

// test('adds 1 + 2 to equal 3', () => {
//   expect(sum(1, 2)).toBe(3)
// })

jest.mock('../multiselect.scss', () => {})

import { mount } from '@vue/test-utils'
import MultiSelect from '../MultiSelect'
const wrapper = mount(MultiSelect)

console.log(wrapper)

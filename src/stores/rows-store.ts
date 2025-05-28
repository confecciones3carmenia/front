import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { ScreenControl } from 'src/common/interfaces/screen-control.interface'

export const userRowsStore = defineStore('rows', {
  state: () => ({
    rows: [] as Array<ScreenControl>,
  }),

  actions: {
    loadRowsFromStorage() {
      const storeRows = localStorage.getItem('rows')
      if (storeRows) {
        this.rows = JSON.parse(storeRows)
      }
    },
    saveRowsToStorage() {
      localStorage.setItem('rows', JSON.stringify(this.rows))
    },
    deleteRow(id: string) {
      this.rows = this.rows.filter((row) => row.id !== id)
      this.saveRowsToStorage()
    },
    deleteStorage() {
      this.rows = []
      localStorage.removeItem('rows')
    },
    addRow(row: ScreenControl) {
      this.rows.push({ ...row, id: uuidv4() })
      this.saveRowsToStorage()
    },
    calculateEfficiency(row: ScreenControl) {
      const now = new Date()
      const { initOperation, timeTotal, timeProvidedUnit, discount } = row
      const totalTimeToFinish = Number(timeTotal) * Number(timeProvidedUnit)
      const [hours, minutes, seconds] = (initOperation ?? '').split(':').map(Number)
      const initTime = new Date()
      initTime.setHours(hours ?? 0, minutes ?? 0, seconds ?? 0)
      const elapsedTime = (now.getTime() - initTime.getTime()) / 60000
      const efficiency = discount ? (totalTimeToFinish / elapsedTime) * 100 - discount : (totalTimeToFinish / elapsedTime) * 100
      row.efficiency = `${efficiency > 100 ? 100 : efficiency.toFixed(2)}%`
    },
    updateOneRow(id: string) {
      const row = this.rows.find((row) => row.id === id)
      if (row) {
        this.calculateEfficiency(row)
        this.saveRowsToStorage()
      }
    },
    updateEfficiency() {
      this.rows.forEach((row) => {
        this.calculateEfficiency(row)
      })
      this.saveRowsToStorage()
    },
  },
})

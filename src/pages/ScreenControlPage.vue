<template>
  <q-page>
    <div>
      <WatchComponent />
    </div>
    <div class="row q-pa-md">
      <div class="col-12 items-end q-mb-md q-gutter-sm" style="text-align: end">
        <q-btn
          square
          dense
          color="white"
          glossy
          text-color="black"
          icon="las la-trash"
          @click="deleteRegistry()"
        >
          <q-tooltip>Borrar los registros</q-tooltip>
        </q-btn>
        <q-btn
          class="text-end"
          square
          dense
          color="white"
          glossy
          text-color="black"
          icon="las la-plus"
          @click="createOperation()"
        >
          <q-tooltip>Agregar usuario a operación</q-tooltip>
        </q-btn>
      </div>
      <div class="col-12 full-width">
        <q-table
          flat
          bordered
          grid
          :rows="rows"
          :columns="columns"
          :rows-per-page-options="[10, 20, 30, 40, 50]"
          row-key="name"
          hide-header
          no-data-label="No hay datos para mostrar en el momento."
        >
          <template v-slot:item="props">
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
              <q-card flat bordered>
                <q-card-section class="text-left">
                  <div
                    class="col text-center"
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                  >
                    <template v-if="col.name === 'efficiency'">
                      <div>
                        <span class="text-h6">Eficacia</span>
                      </div>
                      <q-chip
                        :color="getEfficiencyColor(col.value)"
                        text-color="white"
                        class="q-pa-md q-pl-xl q-pr-xl text-h5"
                      >
                        {{ col.value }}
                      </q-chip>
                    </template>
                  </div>
                  <div class="col q-pa-sm q-pb-md">
                    <span class="text-bold text-h4">{{ getUserNameById(props.row.user) }}</span>
                  </div>
                  <div class="col q-px-sm">
                    <div class="row">
                      <div class="col-4 text-center">
                        <strong>OP:</strong>
                        <br />
                        <span>{{ props.row.operationOrder }}</span>
                      </div>
                      <div class="col-4 text-center">
                        <strong>Hora inicio:</strong>
                        <br />
                        <span>{{ props.row.initOperation }}</span>
                      </div>
                      <div class="col-4 text-center">
                        <strong>Hora meta:</strong>
                        <br />
                        <span>{{ props.row.endOperation }}</span>
                      </div>
                    </div>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-section class="text-center">
                  <q-btn
                    flat
                    dense
                    color="positive"
                    icon="las la-sign-out-alt"
                    @click="finishProcess(props.row)"
                    ><q-tooltip>Finalizar proceso</q-tooltip></q-btn
                  >
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="las la-pencil-alt"
                    @click="editProces(props.row)"
                    ><q-tooltip>Editar proceso</q-tooltip></q-btn
                  >
                  <q-btn
                    flat
                    dense
                    color="negative"
                    icon="las la-trash"
                    @click="deleteOneProcess(props.row)"
                    ><q-tooltip>Eliminar proceso</q-tooltip></q-btn
                  >
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
  <q-dialog
    v-model="fixed"
    persistent
    backdrop-filter="blur(5px)"
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card style="width: 700px; max-width: 80vw">
      <div class="col-12 q-ma-md" style="text-align: start">
        <q-btn
          class="float-right"
          square
          dense
          color="white"
          text-color="black"
          icon="las la-times"
          @click="closeDialog()"
        >
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
        <h5 class="q-my-md">{{ title }} usuario a operación</h5>
      </div>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset">
          <div class="row q-pa-md q-col-gutter-md">
            <div class="col-4">
              <q-input
                v-model="formScreenControl.operationOrder"
                filled
                label="Orden de operación"
                :rules="[(val) => !!val || 'Orden de operación no puede estar vacío']"
              ></q-input>
            </div>
            <div class="col-4">
              <q-select
                v-model="formScreenControl.user"
                :options="userOptions"
                filled
                label="Operario"
                option-label="label"
                option-value="value"
                mat-options
                :rules="[(val) => !!val.value || 'Operario no puede estar vacío']"
              ></q-select>
            </div>
            <div class="col-4">
              <q-select
                v-model="formScreenControl.operationTimes"
                :options="operationTimes"
                multiple
                filled
                use-chips
                stack-label
                label="Operación"
                :disable="disable"
                :rules="[(val) => val.length > 0 || 'Operación no puede estar vacío']"
              ></q-select>
            </div>
            <div class="col-4">
              <q-input
                v-model="formScreenControl.timeProvidedUnit"
                type="number"
                filled
                label="Cantidad"
                :disable="disable"
                :rules="[(val) => !!val || 'Orden de operación no puede estar vacío']"
              ></q-input>
            </div>
            <div v-if="title === 'Editar'" class="col-4">
              <q-input
                v-model="formScreenControl.discount"
                type="number"
                filled
                label="Tiempo descuento"
              ></q-input>
            </div>
            <div class="col-12 q-mt-md" style="text-align: end">
              <q-separator />
              <q-btn flat type="submit" color="positive" class="q-mt-md">{{ title }}</q-btn>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import type { QTable } from 'quasar'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import type { Confection } from 'src/common/interfaces/confection.interface'
import type { Garments } from 'src/common/interfaces/garments.interface'
import type { Operation } from 'src/common/interfaces/operation.interface'
import type { ScreenControl, Value } from 'src/common/interfaces/screen-control.interface'
import type { Time } from 'src/common/interfaces/times.interface'
import type { User } from 'src/common/interfaces/user.interface'
import WatchComponent from 'src/components/WatchComponent.vue'
import { userRowsStore } from 'src/stores/rows-store'
import { onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'

const $q = useQuasar()
const rowsStore = userRowsStore()

const columns = ref<QTable['columns']>([
  {
    name: 'operationOrder',
    required: true,
    label: 'Orden de operación',
    align: 'left',
    field: (row) => row.operationOrder,
  },
  {
    name: 'operator',
    required: true,
    label: 'Operario',
    align: 'left',
    field: (row) => getUserNameById(row.user),
  },
  {
    name: 'operationsToShow',
    required: true,
    label: 'Operaciones',
    align: 'left',
    field: (row) => row.operationsToShow,
  },
  {
    name: 'timeTotal',
    required: true,
    label: 'Tiempo total',
    align: 'left',
    field: (row) => row.timeTotal,
  },
  {
    name: 'timeProvidedUnit',
    required: true,
    label: 'Cantidad',
    align: 'left',
    field: (row) => row.timeProvidedUnit,
  },
  {
    name: 'discount',
    required: true,
    label: 'Tiempo descuento',
    align: 'left',
    field: (row) => row.discount,
  },
  {
    name: 'initOperation',
    required: true,
    label: 'Hora inicio',
    align: 'left',
    field: (row) => row.initOperation,
  },
  {
    name: 'endOperation',
    required: true,
    label: 'Hora meta',
    align: 'left',
    field: (row) => row.endOperation,
  },
  {
    name: 'efficiency',
    required: true,
    label: 'Eficacia',
    align: 'left',
    field: (row) => row.efficiency,
  },
])
const disable = ref<boolean>(false)
const fixed = ref<boolean>(false)
const formScreenControl = ref<ScreenControl>({
  id: null,
  user: { label: null, value: null },
  operationTimes: [] as string[],
  timeProvidedUnit: null,
  timeTotal: 0,
  initOperation: '',
  endOperation: '',
  efficiency: '',
  discount: 0,
  operationsToShow: '',
})
const hour = ref<number>(0)
const minutes = ref<number>(0)
const operationTimes = ref<Array<string>>([])
const lstOperationTimes = ref<Array<Time>>([])
const lstUsers = ref<Array<User>>([])
const rows = ref<Array<ScreenControl>>([])
const title = ref<string>('Agregar')
const userOptions = ref<Array<{ label: string; value: string }>>([])
let efficiencyInterval: number

onBeforeMount(() => {
  rowsStore.loadRowsFromStorage()
  rows.value = rowsStore.rows
})

onMounted(async () => {
  const today = new Date().toISOString().split('T')[0]
  const lastCheckDate = localStorage.getItem('lastScreenControlCheckDate')

  if (lastCheckDate !== today) {
    try {
      localStorage.removeItem('screenControlRows')
      rows.value = []
      if (today) {
        localStorage.setItem('lastScreenControlCheckDate', today)
      }
      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'Registros locales del día anterior limpiados automáticamente.',
        icon: 'info',
      })
    } catch (e) {
      console.error('Error occurred while clearing local data:', e)
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'Error al limpiar los registros locales automáticamente.',
        icon: 'report_problem',
      })
    }
  }

  try {
    $q.loading.show({ message: 'Cargando datos...' })
    await Promise.all([getUsers(), getTimes()])
  } catch (error) {
    $q.notify({
      message: (error as Error).message || 'Error al cargar los datos iniciales.',
      color: 'negative',
      position: 'top',
    })
  } finally {
    $q.loading.hide()
  }

  efficiencyInterval = window.setInterval(() => {
    rowsStore.updateEfficiency()
    rows.value = [...rowsStore.rows]
  }, 20000)
});

onBeforeUnmount(() => {
  rowsStore.saveRowsToStorage()
  clearInterval(efficiencyInterval)
})

function createOperation(): void {
  fixed.value = true
  disable.value = false
  title.value = 'Agregar'
}

function closeDialog(): void {
  fixed.value = false
  onReset()
}

async function onSubmit(): Promise<void> {
  let operationOnSubmit = 0
  lstOperationTimes.value.map((operation) => {
    formScreenControl.value.operationTimes?.forEach((operationTime) => {
      if (operationTime === (<Operation>operation.operation).code) {
        operationOnSubmit += operation.standardTime ?? 0
      }
    })
  })
  formScreenControl.value.operationsToShow =
    formScreenControl.value.operationTimes?.map((operation) => operation ?? '').join(', ') || null

  if (title.value === 'Editar') {
    const index = rows.value.findIndex((row) => row.id === formScreenControl.value.id)
    if (index !== -1) {
      const existingRow = rows.value[index]
      if (existingRow) {
        rows.value[index] = {
          id: existingRow.id ?? null,
          discount: formScreenControl.value.discount ?? null,
          operationOrder: formScreenControl.value.operationOrder ?? null,
          user: existingRow.user ?? '',
          operationTimes: existingRow.operationTimes ?? [],
          timeProvidedUnit: existingRow.timeProvidedUnit ?? null,
          timeTotal: existingRow.timeTotal ?? null,
          initOperation: existingRow.initOperation ?? '',
          endOperation: existingRow.endOperation ?? '',
          efficiency: existingRow.efficiency ?? '',
          operationsToShow: existingRow.operationsToShow ?? '',
        }
        rowsStore.updateOneRow(formScreenControl.value.id ?? '')
      }
    }
  } else {
    formScreenControl.value.timeTotal = operationOnSubmit
    formScreenControl.value.initOperation = getCurrentTime()
    const cantMin =
      Number(formScreenControl.value.timeProvidedUnit) * formScreenControl.value.timeTotal
    formScreenControl.value.endOperation = calculateTargetTime(
      formScreenControl.value.initOperation,
      cantMin,
    )
    formScreenControl.value.efficiency = '100%'
    formScreenControl.value.user = (<Value>formScreenControl.value.user).value
    rows.value = [...rows.value, { ...formScreenControl.value }]
    rowsStore.addRow({ ...formScreenControl.value })
  }
  fixed.value = false
  setTimeout(rowsStore.updateEfficiency, 6000)
  onReset()
}

function editProces(row: ScreenControl): void {
  fixed.value = true
  title.value = 'Editar'
  disable.value = true

  let userId: string | null = null
  if (typeof row.user === 'string') {
    userId = row.user
  } else if (row.user && typeof row.user === 'object' && 'value' in row.user) {
    userId = row.user.value
  }

  formScreenControl.value = {
    ...row,
    user: userId
      ? { label: getUserNameById(userId), value: userId }
      : { label: null, value: null },
  }
}

function deleteRegistry(): void {
  $q.dialog({
    title: 'Eliminar los registros',
    message: '¿Está seguro de eliminar todos los registros?',
    persistent: true,
    ok: {
      label: 'Sí',
      color: 'positive',
      push: true,
    },
    cancel: {
      label: 'No',
      color: 'negative',
      push: true,
    },
  }).onOk(() => {
    rows.value = []
    rowsStore.deleteStorage()
  })
}

function onReset(): void {
  formScreenControl.value = {
    user: null,
    operationTimes: [],
    timeProvidedUnit: null,
    timeTotal: 0,
    initOperation: '',
    endOperation: '',
    efficiency: '',
    discount: 0,
  }
}

function deleteOneProcess(row: ScreenControl) {
  $q.dialog({
    title: 'Eliminar el registro',
    message: '¿Está seguro de eliminar el registro?',
    persistent: true,
    ok: {
      label: 'Sí',
      color: 'positive',
      push: true,
    },
    cancel: {
      label: 'No',
      color: 'negative',
      push: true,
    },
  }).onOk(() => {
    rows.value = rows.value.filter((newRow) => newRow.id !== row.id)
    rowsStore.deleteRow(row.id ?? '')
  })
}

function finishProcess(row: ScreenControl) {
  console.log('edit', row)
  $q.dialog({
    title: 'Finalizar el proceso',
    message:
      '¿Está seguro de finalizar el proceso? Esta operación se cargará en la eficacia de la operación y se eliminará del control.',
    persistent: true,
    ok: {
      label: 'Sí',
      color: 'positive',
      push: true,
    },
    cancel: {
      label: 'No',
      color: 'negative',
      push: true,
    },
  }).onOk(() => {
    $q.loading.show({ message: 'Finalizando proceso...' })
    const times = row.operationTimes
      ?.map((operation) => {
        return lstOperationTimes.value.find(
          (time) => (time.operation as Operation).code === operation,
        )
      })
      .filter(Boolean)
    const nowTime = getCurrentTime()
    const dataToSend: Array<Confection> = []

    times?.forEach((time) => {
      if (time) {
        dataToSend.push({
          operationOrder: row.operationOrder ?? '',
          garmentCode: (time.garment as Garments)._id ?? '',
          operation: (time.operation as Operation)._id ?? '',
          operator: (row.user as string) ?? '',
          units: row.timeProvidedUnit ?? 0,
          initConfection: row.initOperation ?? '',
          endConfection: row.endOperation ?? '',
          estimatedTime: calculateTimeDifferenceInMinutes(
            row.initOperation ?? '',
            row.endOperation ?? '',
          ),
          discountTime: row.discount ?? 0,
          realWorkTime: calculateTimeDifferenceInMinutes(row.initOperation ?? '', nowTime),
          efficiency: row.efficiency ?? '',
        })
      }
    })

    api
      .post('confection/many', dataToSend)
      .then(() => {
        $q.notify({
          message: 'Proceso finalizado con éxito',
          color: 'positive',
          position: 'center',
        })
        rows.value = rows.value.filter((newRow) => newRow.id !== row.id)
        rowsStore.deleteRow(row.id ?? '')
      })
      .catch((error) => {
        $q.notify({
          message: error.message,
          color: 'negative',
          position: 'center',
        })
      })
      .finally(() => {
        $q.loading.hide()
      })
  })
}

async function getUsers(): Promise<void> {
  const response = await api.get('users')
  lstUsers.value = response.data
  userOptions.value = lstUsers.value.map((user) => ({
    label: `${user.name} ${user.lastname}`,
    value: user._id ?? '',
  }))
}

function getUserNameById(userId: string | null): string {
  if (!userId) return 'N/A'
  const user = lstUsers.value.find((user) => user._id === userId)
  return user ? `${user.name} ${user.lastname}` : 'Usuario no encontrado'
}

async function getTimes(): Promise<void> {
  const response = await api.get('/times')
  lstOperationTimes.value = response.data
  operationTimes.value = lstOperationTimes.value.map(
    (time) => (<Operation>time.operation)?.code ?? '',
  )
}

function getCurrentTime(): string {
  const now = new Date()
  hour.value = Number(now.toLocaleTimeString('es-ES', { hour: '2-digit' }))
  minutes.value = Number(now.toLocaleTimeString('es-ES', { minute: '2-digit' }))
  return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function calculateTargetTime(baseTime: string, minutesToAdd: number): string {
  const baseDate = new Date()
  const [hour, minute, second] = baseTime.split(':').map(Number)
  baseDate.setHours(hour ?? 0, minute ?? 0, second ?? 0)
  baseDate.setMinutes(baseDate.getMinutes() + minutesToAdd)
  return baseDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function calculateTimeDifferenceInMinutes(initOperation: string, endOperation: string): number {
  const [initHours, initMinutes, initSeconds] = initOperation.split(':').map(Number)
  const [endHours, endMinutes, endSeconds] = endOperation.split(':').map(Number)

  const initDate = new Date()
  initDate.setHours(initHours ?? 0, initMinutes, initSeconds, 0)

  const endDate = new Date()
  endDate.setHours(endHours ?? 0, endMinutes, endSeconds, 0)

  const differenceInMilliseconds = endDate.getTime() - initDate.getTime()
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60)

  return differenceInMinutes
}

function getEfficiencyColor(value: string): string {
  const efficiency = parseFloat(value.replace('%', '')) || 0
  if (efficiency >= 80) return 'positive'
  if (efficiency >= 70) return 'warning'
  return 'negative'
}
</script>

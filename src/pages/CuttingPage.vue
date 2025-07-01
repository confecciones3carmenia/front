<template>
  <q-page>
    <div class="row q-pa-md">
      <h5 class="q-mt-sm q-mb-sm">Control de corte</h5>
    </div>

    <div v-if="!isReady" class="text-center q-pa-md">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <q-card v-else>
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row q-pa-md q-col-gutter-md">
          <div class="col-md-2 col-12">
            <q-input v-model="formCutting.date" type="date" filled label="Fecha" />
          </div>
          <div class="col-md-2 col-12">
            <q-input
              type="number"
              v-model="formCutting.productionOrder"
              filled
              label="Orden de producción"
            />
          </div>
          <div class="col-md-2 col-12">
            <q-input type="number" v-model="formCutting.streak" filled label="Trazo" />
          </div>
          <div class="col-md-2 col-12">
            <q-input type="number" v-model="formCutting.layers" filled label="Capas" />
          </div>
          <div class="col-md-2 col-12">
            <q-input type="number" v-model="formCutting.longStroke" filled label="Largo trazo" />
          </div>
          <div class="col-md-2 col-12">
            <q-input
              type="number"
              v-model="formCutting.unitsPerLayer"
              filled
              label="Unidades por capa"
            />
          </div>
          <div class="col-md-2 col-12">
            <q-input type="time" v-model="formCutting.initCutter" filled label="Hora inicio" />
          </div>
          <div class="col-md-2 col-12">
            <q-input type="time" v-model="formCutting.endCutter" filled label="Hora final" />
          </div>
          <div class="col-md-2 col-12">
            <q-select v-model="formCutting.operation" use-input input-debounce="0" :options="operations" @filter="filterFn" filled label="Operación" />
          </div>
          <div class="col-md-4 col-12">
            <q-select
              v-model="formCutting.operator"
              :options="userOptions"
              filled
              label="Operador"
            />
          </div>
          <div class="col-12 q-mt-md" style="text-align: end">
            <q-separator />
            <q-btn
              v-if="buttonName === 'Actualizar'"
              flat
              type="reset"
              color="negative"
              class="q-mt-md"
            >
              Cancelar
            </q-btn>
            <q-btn flat type="submit" color="positive" class="q-mt-md">{{ buttonName }}</q-btn>
          </div>
        </div>
      </q-form>

      <div class="col-12 full-width q-pa-sm">
        <q-table
          flat
          bordered
          title="Últimos registros"
          :rows="rows"
          :columns="columns"
          row-key="name"
          no-data-label="No hay datos para mostrar en el momento."
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width>Acciones</q-th>
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <tr>
              <td style="display: table-cell !important">
                <q-btn flat dense color="primary" icon="las la-edit" @click="editCutting(props.row)"
                  ><q-tooltip>Editar rol</q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="las la-trash"
                  @click="deleteCutting(props.row)"
                  ><q-tooltip>Eliminar rol</q-tooltip></q-btn
                >
              </td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </tr>
          </template>
        </q-table>
      </div>
    </q-card>
  </q-page>
</template>
<script lang="ts" setup>
import { QTable, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import type { Cutting } from 'src/common/interfaces/cutting.interface'
import type { User } from 'src/common/interfaces/user.interface'
import type { Operation } from 'src/common/interfaces/operation.interface'
import { onMounted, ref } from 'vue'
import type { Time } from 'src/common/interfaces'

const $q = useQuasar()

const buttonName = ref<string>('Guardar')
const columns = ref<QTable['columns']>([
  {
    name: 'date',
    required: true,
    label: 'Fecha',
    align: 'left',
    field: (row) => row.date,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'productionOrder',
    required: true,
    label: 'Orden de operacion',
    align: 'left',
    field: (row) => row.productionOrder,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'streak',
    required: true,
    label: 'Trazo',
    align: 'left',
    field: (row) => row.streak,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'layers',
    required: true,
    label: 'Capas',
    align: 'left',
    field: (row) => row.layers,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'longStroke',
    required: true,
    label: 'Largo del trazo',
    align: 'left',
    field: (row) => row.longStroke,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'unitsPerLayer',
    required: true,
    label: 'Unidades por capa',
    align: 'left',
    field: (row) => row.unitsPerLayer,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'operation',
    required: true,
    label: 'Operacion',
    align: 'left',
    field: (row) => row.operation,
    format: (val) => (val ? `${val.code}` : ''),
    sortable: true,
  },
  {
    name: 'operator',
    required: true,
    label: 'Operador',
    align: 'left',
    field: (row) => row.operator,
    format: (val) => (val ? `${val.name} ${val.lastname}` : ''),
    sortable: true,
  },
  {
    name: 'initCutter',
    required: true,
    label: 'Hora de inicio',
    align: 'left',
    field: (row) => row.initCutter,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'endCutter',
    required: true,
    label: 'Hora final',
    align: 'left',
    field: (row) => row.endCutter,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'estimatedTime',
    required: true,
    label: 'Tiempo estimado',
    align: 'left',
    field: (row) => row.estimatedTime,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'efficiency',
    required: true,
    label: 'Eficacia',
    align: 'left',
    field: (row) => row.efficiency,
    format: (val) => `${val}`,
    sortable: true,
  },
])
const formCutting = ref<Cutting>({
  _id: '',
  date: '',
  productionOrder: null,
  streak: null,
  layers: null,
  longStroke: null,
  unitsPerLayer: null,
  operation: null,
  operator: null,
  initCutter: '',
  endCutter: '',
  estimatedTime: 0,
  efficiency: '',
})
const lstUsers = ref<Array<User>>([])
const lstOperations = ref<Array<Operation>>([])
const rows = ref<Array<Cutting>>([])
const userOptions = ref<Array<string>>([])
const isReady = ref(false)
const operations = ref<Array<string>>([])
const lstTimes = ref<Array<Time>>([])

onMounted(async () => {
  try {
    await Promise.all([getUsers(), getCuttings(), getOperations(), getTimes()])
    isReady.value = true
  } catch (error) {
    $q.notify({
      message: (error as Error).message || 'Error al cargar los datos iniciales.',
      color: 'negative',
      position: 'top',
    })
  }
})

async function getUsers(): Promise<void> {
  const response = await api.get('users')
  lstUsers.value = response.data
  userOptions.value = lstUsers.value.map((user) => `${user.name} ${user.lastname}`)
}

async function getCuttings(): Promise<void> {
  const response = await api.get('cutting')
  rows.value = response.data
}

async function getOperations(): Promise<void> {
  const response = await api.get('operations')
  lstOperations.value = response.data
  operations.value = lstOperations.value.map((operation) => operation.code).filter((code): code is string => code != null)
}

async function getTimes(): Promise<void> {
  const response = await api.get('times')
  lstTimes.value = response.data
}

function filterFn(
  val: string,
  update: (callback: () => void) => void
): void {
  update(() => {
    const needle = val.toLowerCase()
    operations.value = lstOperations.value
      // 1) keep only non-null codes that match
      .filter(op => op.code != null && op.code.toLowerCase().includes(needle))
      // 2) extract the code string
      .map(op => op.code as string)
  })
}

function onSubmit(): void {
  saveCutting()
}

function onReset(): void {
  buttonName.value = 'Guardar'
  formCutting.value = {
    _id: '',
    date: '',
    productionOrder: null,
    streak: null,
    layers: null,
    longStroke: null,
    unitsPerLayer: null,
    operation: null,
    operator: null,
    initCutter: '',
    endCutter: '',
    estimatedTime: 0,
    efficiency: '',
  }
}

async function saveCutting(): Promise<void> {
  const message =
    buttonName.value === 'Actualizar' ? 'Actualizando trazado...' : 'Guardando trazado...'
  $q.loading.show({ message })
  const id = buttonName.value === 'Actualizar' ? formCutting.value._id : ''
  delete formCutting.value._id
  const user = lstUsers.value.find(
    (u) => `${u.name} ${u.lastname}` === <string>formCutting.value.operator,
  )
  const operation = lstOperations.value.find(g => g.code === (formCutting.value.operation as string));
  if (!operation) {
    console.error(`Operation ${formCutting.value.operation} not found in lstOperations`);
  }
  // Calculate estimatedTime based on Excel formula
  const timeEntry = lstTimes.value.find(t => {
    const op = t.operation;
    const opId = typeof op === 'string' ? op : (op as Operation)._id;
    return opId === operation?._id;
  });
  if (!timeEntry) {
    console.error(`Time entry for operation ${operation?._id} not found`);
  }
  const Q3 = Number(timeEntry?.standardTime) || 0;
  const F3 = Number(formCutting.value.layers) || 0;
  const G3 = Number(formCutting.value.longStroke) || 0;
  const H3 = Number(formCutting.value.streak) || 0;
  let estimatedTimeCalc = 0;
  switch (operation?.code) {
    case 'D1':
      estimatedTimeCalc = (F3 * G3) * Q3;
      break;
    case 'D2':
      estimatedTimeCalc = H3 * Q3;
      break;
    case 'D3':
      estimatedTimeCalc = (H3 * Q3) * 10;
      break;
    case 'D4':
      estimatedTimeCalc = H3 * Q3;
      break;
    case 'D1-D2-D4':
      estimatedTimeCalc = (H3 * Q3) + (0.015 * G3 * F3) * H3;
      break;
    case 'D2-D4':
      estimatedTimeCalc = H3 * Q3;
      break;
    case 'D1-D2':
      estimatedTimeCalc = (Q3 * H3) + (F3 * G3 * H3);
      break;
    case 'D3-D4':
      estimatedTimeCalc = ((H3 * 8) * Q3) + (H3 * 1);
      break;
    default:
      estimatedTimeCalc = 0;
  }
  formCutting.value.estimatedTime = estimatedTimeCalc;

  const partsInit = formCutting.value.initCutter?.split(':').map(Number) ?? [];
  const [initHours = 0, initMinutes = 0, initSeconds = 0] = partsInit;
  const partsEnd = formCutting.value.endCutter?.split(':').map(Number) ?? [];
  const [endHours = 0, endMinutes = 0, endSeconds = 0] = partsEnd;
  const initTime = new Date()
  initTime.setHours(initHours, initMinutes, initSeconds)
  const endTime = new Date()
  endTime.setHours(endHours, endMinutes, endSeconds)
  const elapsedTime = (endTime.getTime() - initTime.getTime()) / 60000
  const efficiency = (formCutting.value.estimatedTime / elapsedTime) * 100
  formCutting.value.efficiency = `${efficiency.toFixed(2)}%`

  const dataToSend: Cutting = {
    operator: user?._id ?? '',
    date: formCutting.value.date,
    productionOrder: formCutting.value.productionOrder,
    streak: formCutting.value.streak,
    layers: formCutting.value.layers,
    unitsPerLayer: formCutting.value.unitsPerLayer,
    longStroke: formCutting.value.longStroke,
    initCutter: formCutting.value.initCutter,
    endCutter: formCutting.value.endCutter,
    operation: operation?._id ?? '',
    estimatedTime: formCutting.value.estimatedTime,
    efficiency: formCutting.value.efficiency,
  }
  if (buttonName.value === 'Actualizar') {
    await api
      .patch(`cutting/${id}`, dataToSend)
      .then(() => {
        $q.notify({
          message: 'Corte actualizado correctamente',
          position: 'top',
          color: 'positive',
        })
        onReset()
        getCuttings()
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        $q.loading.hide()
      })
  } else {
    await api
      .post('cutting', dataToSend)
      .then(() => {
        $q.notify({
          message: 'Corte registrado correctamente',
          position: 'top',
          color: 'positive',
        })
        onReset()
        getCuttings()
      })
      .catch((error) => {
        $q.notify({
          message: error.message,
          position: 'center',
          color: 'negative',
        })
      })
      .finally(() => {
        $q.loading.hide()
      })
  }
}

function editCutting(row: Cutting): void {
  buttonName.value = 'Actualizar'
  formCutting.value = {
    ...row,
    operator: row.operator ? `${(<User>row.operator).name} ${(<User>row.operator).lastname}` : null,
    operation: row.operation ? (<Operation>row.operation).code : null,
  }
}

function deleteCutting(row: Cutting): void {
  $q.dialog({
    title: 'Eliminar registro corte',
    message: '¿Está seguro de eliminar este registro?',
    persistent: true,
    ok: {
      label: 'Sí',
      color: 'positive',
    },
    cancel: {
      label: 'No',
      color: 'negative',
    },
  }).onOk(async () => {
    $q.loading.show({ message: 'Eliminando resgistro...' })
    await api
      .delete(`cutting/${row._id}`)
      .then(() => {
        $q.notify({
          message: 'Registro eliminado correctamente',
          position: 'top',
          color: 'positive',
        })
        getCuttings()
      })
      .catch((error) => {
        $q.notify({
          message: error.message,
          position: 'center',
          color: 'negative',
        })
      })
      .finally(() => {
        $q.loading.hide()
      })
  })
}
</script>

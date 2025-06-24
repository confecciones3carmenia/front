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
            <q-select
              type="number"
              :options="garments"
              v-model="formCutting.garmentCode"
              filled
              label="Código de prenda"
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
            <q-input v-model="formCutting.operation" filled label="Operación" />
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
              >Cancelar</q-btn
            >
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
import type { Garments } from 'src/common/interfaces/garments.interface'
import type { User } from 'src/common/interfaces/user.interface'
import { onMounted, ref } from 'vue'

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
    name: 'garmentCode',
    required: true,
    label: 'Codigo de prenda',
    align: 'left',
    field: (row) => row.garmentCode,
    format: (val) => val?.code ?? '',
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
    format: (val) => `${val}`,
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
])
const formCutting = ref<Cutting>({
  _id: '',
  date: '',
  productionOrder: null,
  garmentCode: null,
  streak: null,
  layers: null,
  longStroke: null,
  unitsPerLayer: null,
  operation: '',
  operator: null,
  initCutter: '',
  endCutter: '',
})
const garments = ref<Array<string>>([])
const lstUsers = ref<Array<User>>([])
const lstGarments = ref<Array<Garments>>([])
const rows = ref<Array<Cutting>>([])
const userOptions = ref<Array<string>>([])
const isReady = ref(false)

onMounted(async () => {
  try {
    await Promise.all([getUsers(), getGarments(), getCuttings()])
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

async function getGarments(): Promise<void> {
  const response = await api.get('garments')
  lstGarments.value = response.data
  garments.value = lstGarments.value.map((garment) => garment.code)
}

async function getCuttings(): Promise<void> {
  const response = await api.get('cutting')
  rows.value = response.data
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
    garmentCode: null,
    streak: null,
    layers: null,
    longStroke: null,
    unitsPerLayer: null,
    operation: '',
    operator: null,
    initCutter: '',
    endCutter: '',
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
  const garmet = lstGarments.value.find((g) => g.code === formCutting.value.garmentCode)
  const dataToSend: Cutting = {
    garmentCode: garmet?._id ?? '',
    operator: user?._id ?? '',
    date: formCutting.value.date,
    productionOrder: formCutting.value.productionOrder,
    streak: formCutting.value.streak,
    layers: formCutting.value.layers,
    unitsPerLayer: formCutting.value.unitsPerLayer,
    longStroke: formCutting.value.longStroke,
    initCutter: formCutting.value.initCutter,
    endCutter: formCutting.value.endCutter,
    operation: formCutting.value.operation,
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
    garmentCode: row.garmentCode ? (<Garments>row.garmentCode).code : null,
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

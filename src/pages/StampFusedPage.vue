<template>
  <q-page>
    <div class="row q-pa-md">
      <h5 class="q-mt-sm q-mb-sm">Control de bordado y fusionado</h5>
    </div>

    <q-card>
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row q-pa-md q-col-gutter-md">
          <div class="col-md-2 col-12">
            <q-input v-model="formStamped.date" type="date" filled label="Fecha" />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formStamped.productionOrder" filled label="Orden de producción" />
          </div>
          <div class="col-md-2 col-12">
            <q-select
              v-model="formStamped.garmentCode"
              filled
              label="Código de prenda"
              :options="garments"
            />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formStamped.fusedPiece" filled label="Pieza fusionada" />
          </div>
          <div class="col-md-2 col-12">
            <q-input
              v-model="formStamped.unitPerPlate"
              type="number"
              filled
              label="Unidades por placa"
            />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formStamped.quantity" type="number" filled label="Cantidad" />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formStamped.initStamped" type="time" filled label="Inicio bordado" />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formStamped.endStamped" type="time" filled label="Fin bordado" />
          </div>
          <div class="col-md-4 col-12">
            <q-select
              v-model="formStamped.operator"
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
                <q-btn flat dense color="primary" icon="las la-edit" @click="editStamped(props.row)"
                  ><q-tooltip>Editar registro</q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="las la-trash"
                  @click="deleteStamped(props.row)"
                  ><q-tooltip>Eliminar registro</q-tooltip></q-btn
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
<script setup lang="ts">
import { api } from 'src/boot/axios'
import type { Garments } from 'src/common/interfaces/garments.interface'
import type { Stamped } from 'src/common/interfaces/stamped.interface'
import { onMounted, ref } from 'vue'
import { QTable, useQuasar } from 'quasar'
import type { User } from 'src/common/interfaces/user.interface'

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
    label: 'Orden de producción',
    align: 'left',
    field: (row) => row.productionOrder,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'garmentCode',
    required: true,
    label: 'Código de prenda',
    align: 'left',
    field: (row) => row.garmentCode,
    format: (val) => val?.code ?? '',
    sortable: true,
  },
  {
    name: 'fusedPiece',
    required: true,
    label: 'Pieza fusionada',
    align: 'left',
    field: (row) => row.fusedPiece,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'unitPerPlate',
    required: true,
    label: 'Unidades por placa',
    align: 'left',
    field: (row) => row.unitPerPlate,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'quantity',
    required: true,
    label: 'Cantidad',
    align: 'left',
    field: (row) => row.quantity,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'initStamped',
    required: true,
    label: 'Inicio bordado',
    align: 'left',
    field: (row) => row.initStamped,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'endStamped',
    required: true,
    label: 'Fin bordado',
    align: 'left',
    field: (row) => row.endStamped,
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
])
const formStamped = ref<Stamped>({
  _id: '',
  date: '',
  productionOrder: null,
  garmentCode: null,
  initStamped: null,
  endStamped: null,
  operator: null,
  fusedPiece: null,
  unitPerPlate: null,
  quantity: null,
})
const garments = ref<Array<string>>([])
const lstGarments = ref<Array<Garments>>([])
const lstUsers = ref<Array<User>>([])
const rows = ref<Array<Stamped>>([])
const userOptions = ref<Array<string>>([])

onMounted(async () => {
  $q.loading.show({ message: 'Cargando datos...' });
  try {
    await Promise.all([getStamped(), getGarments(), getUsers()])
  } catch (error) {
    $q.notify({
      message: (error as Error).message || 'Error al cargar los datos iniciales.',
      color: 'negative',
      position: 'top',
    })
  } finally {
    $q.loading.hide()
  }
})

function onSubmit(): void {
  saveStamped()
}

function onReset(): void {
  buttonName.value = 'Guardar'
  formStamped.value = {
    _id: '',
    date: '',
    productionOrder: null,
    garmentCode: null,
    initStamped: null,
    endStamped: null,
    operator: null,
    fusedPiece: null,
    unitPerPlate: null,
    quantity: null,
  }
}

function saveStamped(): void {
  const message =
    buttonName.value === 'Guardar' ? 'Guardando estampado...' : 'Actualizando estampado...'
  $q.loading.show({ message })
  const id = buttonName.value === 'Guardar' ? '' : formStamped.value._id
  delete formStamped.value._id
  const user = lstUsers.value.find(
    (u) => `${u.name} ${u.lastname}` === <string>formStamped.value.operator,
  )
  const garmet = lstGarments.value.find((g) => g.code === formStamped.value.garmentCode)
  const dataToSend: Stamped = {
    date: formStamped.value.date,
    productionOrder: formStamped.value.productionOrder,
    garmentCode: garmet?._id ?? '',
    fusedPiece: formStamped.value.fusedPiece,
    unitPerPlate: formStamped.value.unitPerPlate,
    quantity: formStamped.value.quantity,
    initStamped: formStamped.value.initStamped,
    endStamped: formStamped.value.endStamped,
    operator: user?._id ?? '',
  }
  if (buttonName.value === 'Guardar') {
    api
      .post('stamped', dataToSend)
      .then(() => {
        $q.notify({
          message: 'Estampado guardado correctamente',
          position: 'center',
          color: 'positive',
        })
        getStamped()
        onReset()
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
  } else {
    api
      .patch(`stamped/${id}`, dataToSend)
      .then(() => {
        $q.notify({
          message: 'Estampado actualizado correctamente',
          position: 'center',
          color: 'positive',
        })
        getStamped()
        onReset()
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

function editStamped(row: Stamped): void {
  buttonName.value = 'Actualizar'
  formStamped.value = {
    ...row,
    operator: row.operator ? `${(<User>row.operator).name} ${(<User>row.operator).lastname}` : null,
    garmentCode: row.garmentCode ? (<Garments>row.garmentCode).code : null,
  }
}

function deleteStamped(row: Stamped): void {
  $q.dialog({
    title: 'Eliminar control de bordado y fusionado',
    message: '¿Está seguro de eliminar este registro?',
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
    $q.loading.show({ message: 'Eliminando registro...' })
    api
      .delete(`stamped/${row._id}`)
      .then(() => {
        $q.notify({
          message: 'Control de bordado y fusionado eliminado',
          position: 'center',
          color: 'positive',
        })
        getStamped()
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

async function getStamped(): Promise<void> {
  const response = await api.get('stamped')
  rows.value = response.data
}

async function getGarments(): Promise<void> {
  const response = await api.get('garments')
  lstGarments.value = response.data
  garments.value = lstGarments.value.map((garment) => garment.code)
}

async function getUsers(): Promise<void> {
  const response = await api.get('users')
  lstUsers.value = response.data
  userOptions.value = lstUsers.value.map((user) => `${user.name} ${user.lastname}`)
}
</script>

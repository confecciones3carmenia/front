<template>
  <q-page>
    <div class="row q-pa-md">
      <h5 class="q-mt-sm q-mb-sm">Control de bordado</h5>
    </div>
    <q-card>
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row q-pa-md q-col-gutter-md">
          <div class="col-md-2 col-12">
            <q-input v-model="formEmbroidery.date" type="date" filled label="Fecha" />
          </div>
          <div class="col-md-2 col-12">
            <q-input
              type="number"
              v-model="formEmbroidery.productionOrder"
              filled
              label="Orden de producción"
            />
          </div>
          <div class="col-md-2 col-12">
            <q-select
              :options="garments"
              v-model="formEmbroidery.garmentCode"
              filled
              label="Código de prenda"
            />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formEmbroidery.embroideryType" filled label="Tipo de bordado" />
          </div>
          <div class="col-md-2 col-12">
            <q-input
              type="number"
              v-model="formEmbroidery.usedHeaders"
              filled
              label="Cabezotes utilizados"
            />
          </div>
          <div class="col-md-2 col-12">
            <q-input v-model="formEmbroidery.size" filled label="Talla" />
          </div>
          <div class="col-md-2 col-12">
            <q-input type="number" v-model="formEmbroidery.quantity" filled label="Cantidad" />
          </div>
          <div class="col-md-3 col-12">
            <q-input
              type="time"
              v-model="formEmbroidery.initEmbroidery"
              filled
              label="Hora inicio"
            />
          </div>
          <div class="col-md-3 col-12">
            <q-input type="time" v-model="formEmbroidery.endEmbroidery" filled label="Hora final" />
          </div>
          <div class="col-md-4 col-12">
            <q-select
              v-model="formEmbroidery.operator"
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
                <q-btn flat dense color="primary" icon="las la-edit" @click="editEmbroidery(props.row)"
                  ><q-tooltip>Editar registro</q-tooltip></q-btn
                >
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="las la-trash"
                  @click="deleteEmbroidery(props.row)"
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
<script lang="ts" setup>
import { api } from 'src/boot/axios'
import type { Embroidery } from 'src/common/interfaces/embroidery.interface'
import { onMounted, ref } from 'vue'
import type { QTable } from 'quasar'
import { useQuasar } from 'quasar'
import type { Garments } from 'src/common/interfaces/garments.interface'
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
    name: 'embroideryType',
    required: true,
    label: 'Tipo de bordado',
    align: 'left',
    field: (row) => row.embroideryType,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'usedHeaders',
    required: true,
    label: 'Cabezotes utilizados',
    align: 'left',
    field: (row) => row.usedHeaders,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'size',
    required: true,
    label: 'Talla',
    align: 'left',
    field: (row) => row.size,
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
    name: 'initEmbroidery',
    required: true,
    label: 'Hora inicio',
    align: 'left',
    field: (row) => row.initEmbroidery,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'endEmbroidery',
    required: true,
    label: 'Hora final',
    align: 'left',
    field: (row) => row.endEmbroidery,
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
const formEmbroidery = ref<Embroidery>({
  _id: '',
  date: '',
  productionOrder: null,
  garmentCode: null,
  initEmbroidery: null,
  endEmbroidery: null,
  embroideryType: null,
  usedHeaders: null,
  size: null,
  quantity: null,
  operator: null,
})
const garments = ref<Array<string>>([])
const lstGarments = ref<Array<Garments>>([])
const lstUsers = ref<Array<User>>([])
const rows = ref<Array<Embroidery>>([])
const userOptions = ref<Array<string>>([])

onMounted(async () => {
  $q.loading.show({ message: 'Cargando datos...' });
  try {
    await Promise.all([getUsers(), getGarments(), getEmbrodery()]);
  } catch (error) {
    $q.notify({
      message: (error as Error).message || 'Error al cargar los datos iniciales.',
      color: 'negative',
      position: 'top',
    });
  } finally {
    $q.loading.hide();
  }
});

function onSubmit() {
  saveEmbroidery()
}

async function saveEmbroidery() {
  const message =
    buttonName.value === 'Actualizar' ? 'Actualizando bordado...' : 'Guardando bordado...'
  $q.loading.show({ message })
  const id = buttonName.value === 'Actualizar' ? formEmbroidery.value._id : ''
  delete formEmbroidery.value._id
  const user = lstUsers.value.find(
    (u) => `${u.name} ${u.lastname}` === <string>formEmbroidery.value.operator,
  )
  const garmet = lstGarments.value.find((g) => g.code === formEmbroidery.value.garmentCode)
  const dataToSend: Embroidery = {
    garmentCode: garmet?._id ?? '',
    operator: user?._id ?? '',
    date: formEmbroidery.value.date,
    productionOrder: formEmbroidery.value.productionOrder,
    initEmbroidery: formEmbroidery.value.initEmbroidery,
    endEmbroidery: formEmbroidery.value.endEmbroidery,
    embroideryType: formEmbroidery.value.embroideryType,
    usedHeaders: formEmbroidery.value.usedHeaders,
    size: formEmbroidery.value.size,
    quantity: formEmbroidery.value.quantity,
  }
  if (buttonName.value === 'Actualizar') {
    console.log('ingreso por el update')
    api
      .patch(`embroidery/${id}`, dataToSend)
      .then(() => {
        $q.notify({
          message: 'Bordado actualizado correctamente',
          position: 'top',
          color: 'positive',
        })
        onReset()
        getEmbrodery()
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
      .post('embroidery', dataToSend)
      .then(() => {
        $q.notify({
          message: 'Bordado registrado correctamente',
          position: 'top',
          color: 'positive',
        })
        onReset()
        getEmbrodery()
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

function onReset() {
  buttonName.value = 'Guardar'
  formEmbroidery.value = {
    _id: '',
    date: '',
    productionOrder: null,
    garmentCode: null,
    initEmbroidery: null,
    endEmbroidery: null,
    embroideryType: null,
    usedHeaders: null,
    size: null,
    quantity: null,
    operator: null,
  }
}

function editEmbroidery(row: Embroidery) {
  buttonName.value = 'Actualizar'
  formEmbroidery.value = {
    ...row,
    operator: row.operator ? `${(<User>row.operator).name} ${(<User>row.operator).lastname}` : null,
    garmentCode: (<Garments>row.garmentCode)?.code ?? null,
  }
}

function deleteEmbroidery(row: Embroidery) {
  $q.dialog({
    title: 'Eliminar control de bordado',
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
  }).onOk(() => {
    $q.loading.show({ message: 'Eliminando registro...' })
    api
      .delete(`embroidery/${row._id}`)
      .then(() => {
        $q.notify({
          message: 'Control de bordado eliminado',
          position: 'top',
          color: 'positive',
        })
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
        getEmbrodery()
      })
  })
}

async function getEmbrodery() {
  const response = await api.get('embroidery');
  rows.value = response.data;
}

async function getGarments() {
  const response = await api.get('garments');
  lstGarments.value = response.data;
  garments.value = lstGarments.value.map((garment) => garment.code);
}

async function getUsers() {
  const response = await api.get('users');
  lstUsers.value = response.data;
  userOptions.value = lstUsers.value.map(
    (user) => `${user.name} ${user.lastname}`
  );
}
</script>

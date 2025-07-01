<template>
  <q-page>
    <div class="row q-pa-md">
      <div class="col-12 items-end q-mb-md" style="text-align: end">
        <q-btn class="text-end q-mr-sm" square color="white" glossy text-color="black" icon="las la-file-upload"
          @click="triggerFileInput()">
          <q-tooltip>Carga Masiva de Operaciones</q-tooltip>
        </q-btn>
        <q-btn class="text-end" square color="white" glossy text-color="black" icon="las la-plus"
          @click="createOperation()">
          <q-tooltip>Agregar operación</q-tooltip>
        </q-btn>
        <input type="file" ref="fileInput" @change="handleFileUpload" accept=".xlsx, .xls" style="display: none" />
      </div>
      <div class="col-12 full-width">
        <q-table flat bordered title="Operaciones" :rows="rows" :columns="columns" row-key="name" :filter="filter"
          no-data-label="No hay datos para mostrar en el momento.">
          <template v-slot:top>
            <p class="text-h5">Operaciones</p>
            <q-space />
            <q-input flat bordered debounce="300" placeholder="Buscar..." color="primary" v-model="filter">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
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
                <q-btn flat dense color="primary" icon="las la-edit" @click="editUser(props.row)"><q-tooltip>Editar
                    registro</q-tooltip></q-btn>
                <q-btn flat dense color="negative" icon="las la-trash"
                  @click="deleteUser(props.row)"><q-tooltip>Eliminar registro</q-tooltip></q-btn>
              </td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
            </tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
  <q-dialog v-model="fixed" persistent backdrop-filter="blur(5px)" transition-show="fade" transition-hide="fade">
    <q-card>
      <div class="col-12 q-ma-md" style="text-align: start">
        <q-btn class="float-right" square dense color="white" text-color="black" icon="las la-times"
          @click="closeDialog()">
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
        <h5 class="q-my-md">{{ title }} operación</h5>
      </div>
      <q-separator />
      <q-form @submit="onSubmit" @reset="onReset">
        <div class="row q-pa-md q-col-gutter-md">
          <div class="col-4">
            <q-input v-model="formOperation.code" filled label="Código"></q-input>
          </div>
          <div class="col-8">
            <q-input v-model="formOperation.name" filled label="Nombre"></q-input>
          </div>
          <div class="col-12 q-mt-md" style="text-align: end">
            <q-separator />
            <q-btn flat type="submit" color="positive" class="q-mt-md">{{ buttonName }}</q-btn>
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script lang="ts" setup>
import { QTable, useQuasar } from 'quasar'
import { api } from 'src/boot/axios';
import axios from 'axios';
import * as XLSX from 'xlsx';
import type { Operation } from 'src/common/interfaces/operation.interface'
import { onMounted, ref } from 'vue'
import type { OperationExcelRow } from 'src/common/interfaces/excels.interface';

const $q = useQuasar()

const buttonName = ref<string>('Guardar')
const columns = ref<QTable['columns']>([
  {
    name: 'code',
    required: true,
    label: 'Código',
    align: 'left',
    field: (row) => row.code,
  },
  {
    name: 'name',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: (row) => row.name,
  },
])
const fixed = ref<boolean>(false)
const formOperation = ref<Operation>({
  _id: '',
  code: '',
  name: '',
})
const title = ref<string>('Crear')
const rows = ref<Array<Operation>>([])
const filter = ref<string>('')

onMounted(() => {
  getOperations()
})

function getOperations() {
  $q.loading.show({
    message: 'Cargando operaciones...',
  })
  api
    .get<Array<Operation>>('/operations')
    .then((response) => {
      console.log('response', response)
      rows.value = response.data
    })
    .catch((error) => {
      $q.notify({
        message: error.message,
        position: 'top',
        color: 'negative',
      })
    })
    .finally(() => {
      $q.loading.hide()
    })
}

function createOperation() {
  title.value = 'Crear'
  buttonName.value = 'Guardar'
  fixed.value = true
}

function closeDialog() {
  fixed.value = false
  onReset()
}

function onSubmit() {
  if (title.value === 'Crear') {
    saveOperation()
  } else {
    updateOperation()
  }
}

function saveOperation() {
  $q.loading.show({
    message: 'Guardando operación...',
  })
  delete formOperation.value._id
  api
    .post('/operations', formOperation.value)
    .then(() => {
      $q.notify({
        message: 'Operación guardada con éxito',
        position: 'center',
        color: 'positive',
      })
      getOperations()
      fixed.value = false
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

function updateOperation() {
  console.log('el valor del form', formOperation.value)
  const id = formOperation.value._id
  delete formOperation.value._id
  $q.loading.show({
    message: 'Actualizando operación...',
  })
  api
    .patch(`/operations/${id}`, formOperation.value)
    .then(() => {
      $q.notify({
        message: 'Operación actualizada con éxito',
        position: 'center',
        color: 'positive',
      })
      getOperations()
      fixed.value = false
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

function onReset() {
  formOperation.value = {
    _id: '',
    code: '',
    name: '',
  }
}

function editUser(row: Operation) {
  console.log('editUser', row)
  fixed.value = true
  title.value = 'Editar'
  buttonName.value = 'Actualizar'
  formOperation.value = {
    _id: row._id ?? '',
    code: row.code,
    name: row.name,
  }
}

function deleteUser(row: Operation) {
  $q.dialog({
    title: 'Eliminar operación',
    message: 'Esta seguro de eliminar la operación?',
    ok: {
      push: true,
      color: 'negative',
      label: 'Sí',
    },
    cancel: {
      push: true,
      color: 'primary',
      label: 'No',
    },
    persistent: true,
  }).onOk(() => {
    api
      .delete(`/operations/${row._id}`)
      .then(() => {
        $q.notify({
          message: 'Operación eliminada con éxito',
          position: 'center',
          color: 'positive',
        })
        getOperations()
      })
      .catch((error) => {
        $q.notify({
          message: error.message,
          position: 'center',
          color: 'negative',
        })
      })
  })
}

const fileInput = ref<HTMLInputElement | null>(null);

function triggerFileInput(): void {
  fileInput.value?.click();
}

async function handleFileUpload(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    $q.notify({
      message: 'No se seleccionó ningún archivo.',
      color: 'warning',
      position: 'top',
    });
    return;
  }

  if (!file.name.match(/\.(xlsx|xls)$/)) {
    $q.notify({
      message: 'Por favor, seleccione un archivo Excel (.xlsx o .xls).',
      color: 'negative',
      position: 'top',
    });
    if (target) {
      target.value = ''; // Reset input if wrong file type
    }
    return;
  }

  $q.loading.show({ message: 'Procesando archivo...' });

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0] ?? '';
    const worksheet = workbook.Sheets[firstSheetName];

    if (!worksheet) {
      $q.notify({
        message: 'No se pudo encontrar una hoja de cálculo válida en el archivo Excel.',
        color: 'negative',
        position: 'top',
      });
      if (target) target.value = '';
      $q.loading.hide();
      return;
    }

    const jsonData = XLSX.utils.sheet_to_json<OperationExcelRow>(worksheet);

    const operationsToCreate = jsonData
      .map((item: OperationExcelRow) => ({
        code: item.codigo !== undefined && item.codigo !== null ? String(item.codigo).trim() : '',
        name: item.nombre !== undefined && item.nombre !== null ? String(item.nombre).trim() : '',
      }))
      .filter((item: { code: string; name: string }) => item.code && item.name);

    if (operationsToCreate.length === 0) {
      $q.notify({
        message: 'No se encontraron datos válidos (codigo, nombre) en el archivo Excel.',
        color: 'warning',
        position: 'top',
        timeout: 7000,
      });
      if (target) target.value = '';
      $q.loading.hide();
      return;
    }

    await bulkSaveOperations(operationsToCreate);
  } catch (error) {
    console.error('Error procesando el archivo Excel:', error);
    $q.notify({
      message: 'Error al procesar el archivo Excel.',
      color: 'negative',
      position: 'top',
    });
  } finally {
    $q.loading.hide();
    if (target) {
      target.value = ''; // Reset file input to allow re-selection
    }
  }
}

async function bulkSaveOperations(operations: Array<{ code: string; name: string }>): Promise<void> {
  if (operations.length === 0) {
    $q.notify({
      message: 'No hay operaciones para guardar.',
      color: 'info',
      position: 'top',
    });
    return;
  }

  $q.loading.show({ message: `Guardando ${operations.length} operaciones...` });
  try {
    // Ensure your backend endpoint for bulk operations is 'operations/bulk'
    await api.post('operations/bulk', operations);

    $q.notify({
      message: `${operations.length} operaciones guardadas masivamente con éxito.`,
      color: 'positive',
      position: 'top',
    });
    getOperations(); // Refresh the list
  } catch (error: unknown) {
    console.error('Error en la carga masiva de operaciones:', error);
    let errorMessage = 'Error desconocido durante la carga masiva.';
    if (axios.isAxiosError(error)) {
      if (error.response && error.response.data && typeof error.response.data.message === 'string') {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    $q.notify({
      message: `Error en la carga masiva: ${errorMessage}`,
      color: 'negative',
      position: 'top',
      timeout: 7000,
    });
  } finally {
    $q.loading.hide();
  }
}
</script>

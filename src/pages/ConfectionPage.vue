<template>
  <q-page>
    <div class="row q-pa-md">
      <q-table
        flat
        bordered
        title="Eficacia de confección"
        :rows="rows"
        :columns="columns"
        row-key="name"
        no-data-label="No hay datos para mostrar en el momento."
      >
        <template v-slot:body-cell-garment="props">
          <q-td :props="props">
            <q-tooltip>
              {{ props.row.garmentCode.name }}
            </q-tooltip>
            {{ truncateText(props.row.garmentCode.name, 10) }}
          </q-td>
        </template>
        <template v-slot:body-cell-operation="props">
          <q-td :props="props">
            <q-tooltip>
              {{ props.row.operation.name }}
            </q-tooltip>
            {{ truncateText(props.row.operation.name, 15) }}
          </q-td>
        </template>
        <template v-slot:body-cell-efficiency="props">
          <q-td :props="props">
            <q-chip :color="getEfficiencyColor(props.row.efficiency)" text-color="white">
              {{ props.row.efficiency }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script lang="ts" setup>
import { QTable, useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import type { Confection } from 'src/common/interfaces/confection.interface'
import { onMounted, ref } from 'vue'
import { format } from 'date-fns'

const $q = useQuasar()

const columns = ref<QTable['columns']>([
  {
    name: 'createAt',
    required: true,
    label: 'Fecha',
    align: 'left',
    field: (row) => formatDate(row.createdAt),
  },
  {
    name: 'operator',
    required: true,
    label: 'Operario',
    align: 'left',
    field: (row) => `${row.operator.name} ${row.operator.lastname}`,
  },
  {
    name: 'operationOrder',
    required: true,
    label: 'OP',
    align: 'left',
    field: (row) => row.operationOrder,
  },
  {
    name: 'garment',
    required: true,
    label: 'Prenda',
    align: 'left',
    field: (row) => row.garmentCode.name,
    format: (val) => truncateText(val, 10),
  },
  {
    name: 'operation',
    required: true,
    label: 'Operación',
    align: 'left',
    field: (row) => row.operation.name,
    format: (val) => truncateText(val, 15),
  },
  {
    name: 'units',
    required: true,
    label: 'Unidades',
    align: 'left',
    field: (row) => row.units,
  },
  {
    name: 'estimatedTime',
    required: true,
    label: 'T. estimado',
    align: 'left',
    field: (row) => row.estimatedTime,
  },
  {
    name: 'discountTime',
    required: true,
    label: 'T. descuento',
    align: 'left',
    field: (row) => row.discountTime,
  },
  {
    name: 'realWorkTime',
    required: true,
    label: 'Tiempo real de trabajo',
    align: 'left',
    field: (row) => row.realWorkTime,
  },
  {
    name: 'efficiency',
    required: true,
    label: 'Eficiencia',
    align: 'left',
    field: (row) => row.efficiency,
  },
])
const rows = ref<Array<Confection>>([])

onMounted(() => {
  getConfection()
})

function getConfection(): void {
  $q.loading.show({
    message: 'Cargando confecciones...',
  })
  api
    .get('/confection')
    .then((response) => {
      console.log('la data que llega', response)
      rows.value = response.data
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

function formatDate(date: string) {
  const newDate = date.split('T')[0]
  const finishDate = newDate?.split('-') ?? []
  return format(
    new Date(Number(finishDate[0]), Number(finishDate[1]) - 1, Number(finishDate[2])),
    'yyyy-MM-dd',
  )
}

function truncateText(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + '...' : text
}

function getEfficiencyColor(value: string): string {
  const efficiency = parseFloat(value.replace('%', '')) || 0;
  if (efficiency >= 80) return 'positive';
  if (efficiency >= 70) return 'warning';
  return 'negative';
}
</script>

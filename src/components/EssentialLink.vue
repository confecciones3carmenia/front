<template>
  <q-item
    v-if="!subLinks || subLinks.length === 0"
    clickable
    tag="a"
    :to="to"
    active-class="my-active-class"
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label v-if="caption" caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-expansion-item v-else :icon="icon" :label="title" :caption="caption">
    <q-list padding>
      <q-item
        v-for="subLink in subLinks"
        :key="subLink.title"
        clickable
        tag="a"
        :to="subLink.to"
        class="submenu-item"
        active-class="my-active-class"
      >
        <q-item-section v-if="subLink.icon" avatar>
          <q-icon :name="subLink.icon" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ subLink.title }}</q-item-label>
          <q-item-label v-if="subLink.caption" caption>{{ subLink.caption }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>
</template>

<script setup lang="ts">
import type { EssentialLinkProps } from 'src/common/interfaces/menus.interface'

defineProps<EssentialLinkProps>()
</script>

<style lang="scss">
.my-active-class {
  background-color: rgba($color: #8e1720, $alpha: 0.8);
  color: white;
}

.submenu-item {
  padding-left: 36px !important;
}

.q-expansion-item__content {
  .q-list {
    border-left: 2px solid rgba($color: #8e1720, $alpha: 0.2);
    margin-left: 16px;
  }
}
</style>

<template>

<div class="dropdown is-right is-hoverable is-pulled-right">
  <div class="dropdown-trigger">
    <button class="button is-small" aria-haspopup="true" :aria-controls="id">
      <span class="icon is-small">
        <i class="fas fa-trash has-text-danger" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div class="dropdown-menu" :id="id" role="menu">
    <div class="dropdown-content">
      <div class="dropdown-item">
        <button class="button is-danger" @click="onClickDelete">
            TODO: この条件を削除する
        </button>
      </div>
    </div>
  </div>
</div>


</template>

<script setup lang="ts">

const props = defineProps<{
    condition_id: number;
}>();
const emit = defineEmits(["delete"]);

const id=`conditionDelete${props.condition_id}`;

const onClickDelete = () => {
    emit("delete");
}
</script>
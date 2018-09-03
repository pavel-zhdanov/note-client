<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card v-if="!loading">
          <v-img
            :src="note.imageSrc || defaultImageSrc"
            height="300px"
          >
          </v-img>
          <v-card-text>
            <h1 class="text--primary">{{note.title}}</h1>
            <h2>{{note.description}}</h2>
            <p>{{note.text}}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat class="warning">Delete</v-btn>
            <app-edit-note-modal :note="note"></app-edit-note-modal>
          </v-card-actions>
        </v-card>
        <v-flex v-else xs12 class="text-xs-center">
          <v-progress-circular
            :size="150"
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import EditNoteModal from './EditNoteModal';

  export default {
    props: ['id'],
    data() {
      return {};
    },
    computed: {
      note() {
        const id = this.id;
        return this.$store.getters.noteById(id);
      },
      defaultImageSrc() {
        return this.$store.getters.defaultImageSrc;
      },
      loading() {
        return this.$store.getters.loading;
      },
    },
    components: {
      appEditNoteModal: EditNoteModal,
    },
  };
</script>

<style scoped>

</style>


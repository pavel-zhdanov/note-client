<template>
  <v-container>
    <v-layout row v-if="note">
      <v-flex xs12 sm6 offset-sm3>
        <v-card v-if="!loading">
          <v-img
            :src="note.imageSrc || defaultImageSrc"
            height="300px"
          >
          </v-img>
          <v-card-text>
            <h1 class="text--primary">{{note.title}}</h1>
            <v-divider></v-divider>
            <h2>{{note.description}}</h2>
            <v-divider></v-divider>
            <p>{{note.text}}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat v-if="note.authorId === user.id" class="warning" @click="onDelete">Delete</v-btn>
            <app-edit-note-modal v-if="note.authorId === user.id" :note="note"></app-edit-note-modal>
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

    <v-layout v-else>
      <<v-progress-circular
      indeterminate
      color="primary"
      :size="200"
      :width="20"
    ></v-progress-circular>
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
      user() {
        return this.$store.getters.user;
      },
    },
    methods: {
      onDelete() {
        this.$store.dispatch('deleteNote', {
          id: this.note.id,
        })
          .then(() => {
            this.$router.push('/list');
          })
          .catch(() => {});
      },
    },
    components: {
      appEditNoteModal: EditNoteModal,
    },
  };
</script>

<style scoped>

</style>


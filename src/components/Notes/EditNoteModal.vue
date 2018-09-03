<template>
  <v-dialog
    width="400px"
    v-model="modal">
    <v-btn class="primary" slot="activator">Edit</v-btn>
    <v-card>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-card-title>
              <h1 class="text--primary">Edit note</h1>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-card-text>
              <v-form ref="form" v-model="valid" validation>
              <v-text-field
                name="title"
                label="Title"
                type="text"
                v-model="editedTitle"
                required
                :rules="[(v) => !!v || 'Title is required!']"
              ></v-text-field>
              <v-textarea
                name="description"
                label="Description"
                type="text"
                v-model="editedDescription"
                required
                :rules="[(v) => !!v || 'Description is required!']"
              ></v-textarea>
                </v-form>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat @click="onCancel">Cancel</v-btn>
              <v-btn
                raised
                @click="onSave"
                color="primary"
                class="white--text"
                :disabled="!valid || loading"
                :loading="loading"
              >Save</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        modal: false,
        editedTitle: this.note.title,
        editedDescription: this.note.description,
        valid: false,
      };
    },
    methods: {
      onCancel() {
        this.editedTitle = this.note.title;
        this.editedDescription = this.note.description;
        this.modal = false;
      },
      onSave() {
        this.$store.dispatch('updateNote', {
          title: this.editedTitle,
          description: this.editedDescription,
          id: this.note.id,
        })
          .then(() => {
            this.modal = false;
          })
          .catch(() => {});
      },
    },
    props: ['note'],
    computed: {
      loading() {
        return this.$store.getters.loading;
      },
    },
  };
</script>

<style scoped>

</style>

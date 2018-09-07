<template>
  <v-dialog
    v-model="modal"
    max-width="1500px">
    <v-btn class="primary" slot="activator">Edit</v-btn>
    <v-card>
      <v-container>
        <v-layout row>
          <v-flex xs12 lg10 offset-lg1>
            <v-card-title>
              <h1 class="text--primary">Edit note</h1>
            </v-card-title>
            <v-form ref="form" v-model="valid"  class="pa-3 pt-4">
              <v-text-field
                name="title"
                label="Title"
                type="text"
                v-model="editedTitle"
              ></v-text-field>
              <v-textarea
                name="description"
                label="Description"
                type="text"
                v-model="editedDescription"
                auto-grow
                rows="3"
              ></v-textarea>
              <v-textarea
                name="text"
                label="Note text"
                type="text"
                v-model="editedText"
                rows="10"
              ></v-textarea>
              <v-switch
                label="Note is private?"
                v-model="editedIsPrivate"
                color="primary"
              ></v-switch>
            </v-form>
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
        editedText: this.note.text,
        editedIsPrivate: this.note.isPrivate,
        valid: false,
      };
    },
    methods: {
      onCancel() {
        this.editedTitle = this.note.title;
        this.editedDescription = this.note.description;
        this.editedText = this.note.text;
        this.editedIsPrivate = this.note.isPrivate;
        this.modal = false;
      },
      onSave() {
        this.$store.dispatch('updateNote', {
          title: this.editedTitle,
          description: this.editedDescription,
          text: this.editedText,
          isPrivate: this.editedIsPrivate,
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

<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2 lg6 offset-lg3 >
        <h1 class="text--secondary pa-2">Create New Note</h1>
        <v-form ref="form" v-model="valid" validation class="pa-2">
          <v-text-field
            name="title"
            label="Note title"
            type="text"
            v-model="title"
          ></v-text-field>
          <v-textarea
            name="description"
            label="Note description"
            type="text"
            v-model="description"
          ></v-textarea>
          <v-textarea
            name="text"
            label="Note text"
            type="text"
            v-model="text"
          ></v-textarea>
        </v-form>

        <v-btn class="white--text mb-3" color="primary" @click="triggerUpload">Upload preview
          <v-icon right dark>cloud_upload</v-icon>
        </v-btn>
        <input
          ref="fileInput"
          type="file"
          style="display: none;"
          accept="image/*"
          @change="onFileChange"
        >
        <img :src="imageSrc" alt="" height="150" v-if="imageSrc">
        <v-switch
          class="pa-2"
          label="Add to private?"
          v-model="isPrivate"
          color="primary"
        ></v-switch>
        <v-switch
          class="pa-2"
          label="Encode this note?"
          v-model="encode"
          color="primary"
        ></v-switch>
        <v-text-field
          class="pa-2"
          v-if="encode"
          name="key"
          label="Key for encode note"
          type="text"
          v-model="key"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          class="white--text"
          color="primary"
          @click="createNote"
          :disabled="!valid || loading"
          :loading="loading"
        >Create Note</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        title: '',
        description: '',
        text: '',
        isPrivate: false,
        image: null,
        imageSrc: '',
        encode: false,
        key: '',
        valid: false,
      };
    },
    computed: {
      loading() {
        return this.$store.getters.loading;
      },
    },
    methods: {
      createNote() {
        if (this.$refs.form.validate()) {
          const note = {
            title: this.title,
            description: this.description,
            text: this.text,
            isPrivate: this.isPrivate,
            image: this.image,
            key: this.key,
          };
          this.$store.dispatch('createNote', note)
            .then(() => this.$router.push('/'))
            .catch();
        }
      },
      triggerUpload() {
        this.$refs.fileInput.click();
      },
      onFileChange(evt) {
        const file = evt.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          this.imageSrc = reader.result;
        };
        reader.readAsDataURL(file);
        this.image = file;
      },
    },
  };
</script>

<style scoped>

</style>

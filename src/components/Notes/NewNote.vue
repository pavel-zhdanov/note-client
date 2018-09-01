<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary">Create New Note</h1>

        <v-form ref="form" v-model="valid" validation>
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
            name="description"
            label="Note text"
            type="text"
            v-model="text"
          ></v-textarea>
        </v-form>

        <v-layout row>
          <v-flex xs12>
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
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12>
            <img :src="imageSrc" alt="" height="100" v-if="imageSrc">
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12>
            <v-switch
              label="Add to private?"
              v-model="private"
              color="primary"
            ></v-switch>
          </v-flex>
        </v-layout>

        <v-layout row>
          <v-flex xs12>
            <v-spacer></v-spacer>
            <v-btn
              class="white--text"
              color="primary"
              @click="createNote"
              :disabled="!valid"
            >Create Note</v-btn>
          </v-flex>
        </v-layout>

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
        private: false,
        image: null,
        imageSrc: '',
        valid: false,
      };
    },
    methods: {
      createNote() {
        if (this.$refs.form.validate()) {
          const note = {
            title: this.title,
            description: this.description,
            text: this.text,
            private: this.private,
            image: this.image,
          };
          this.$store.dispatch('createNote', note);
        }
      },
      triggerUpload() {
        this.$refs.fileInput.click();
      },
      onFileChange(evt) {
        const file = evt.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          if (e) throw new Error('load unsucsecc');
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

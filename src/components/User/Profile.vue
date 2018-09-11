<template>
  <v-container>
    <v-layout
      justify-center
      row>
      <v-flex xs12 sm10 md 8 lg6>
        <v-card v-if="!loading">

          <v-img
            v-if="imageSrc || user.avatarSrc"
            :src="imageSrc || user.avatarSrc"
          >
          </v-img>

          <v-btn
            class="white--text mb-3"
            color="primary"
            @click="triggerUpload"
          >Upload avatar
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
          <input
            ref="fileInput"
            type="file"
            style="display: none;"
            accept="image/*"
            @change="onFileChange"
          >

          <v-card-text style="word-wrap: break-word">
            <v-form ref="form" v-model="valid"  class="pa-3 pt-4">
              <v-text-field
                name="nickname"
                label="Nickname"
                type="text"
                v-model="editedNickname"
                :rules="nicknameRules"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions pa-5>
            <v-spacer></v-spacer>
            <v-btn
              raised
              color="primary"
              class="white--text"
              :loading="loading"
              :disabled="!valid || loading"
              @click="onSubmit"
            >Save</v-btn>
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
  export default {
    data() {
      return {
        valid: true,
        nicknameRules: [
          v => !!v || 'Nickname is required',
          v => (v && v.length >= 4) || 'Nickname must be equal or more than 4 characters',
        ],
        image: null,
        imageSrc: '',
      };
    },
    computed: {
      user() {
        window.console.log('COMPUTED');
        return this.$store.getters.user;
      },
      loading() {
        return this.$store.getters.loading;
      },
    },
    methods: {
      onSubmit() {
        const data = {
          nickname: this.editedNickname,
          image: this.image };
        this.$store.dispatch('updateUserData', data)
          .then(() => this.$router.push('/'))
          .catch(() => {});
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
    created() {
      this.editedNickname = this.user.nickname;
    },
  };

</script>

<style scoped>

</style>

<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6 lg5 xl4>

        <v-stepper v-model="step" alt-labels>
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">Create account</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 2" step="2">Enter your nickname</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Download your avatar</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>

            <v-stepper-content step="1">
              <v-card>
                <v-card-text>
                  <v-form v-model="valid" ref="form" lazy-validation>
                    <v-text-field
                      prepend-icon="person"
                      name="email"
                      label="Email"
                      type="email"
                      v-model="email"
                      :rules="emailRules"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="lock"
                      name="password"
                      label="Password"
                      type="password"
                      v-model="password"
                      :rules="passwordRules"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="lock"
                      name="confirm-password"
                      label="Confirm password"
                      type="password"
                      v-model="confirmPassword"
                      :rules="confirmPasswordRules"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    @click="onCompleteFirstStep"
                    :loading="loading"
                    :disabled="!valid || loading"
                  >
                    Continue
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card>
                <v-card-text>
                  <v-form v-model="validNickname" ref="formNickname" lazy-validation>
                    <v-text-field
                      prepend-icon="person"
                      name="nickname"
                      label="Nickname"
                      type="text"
                      v-model="nickname"
                      :rules="nicknameRules"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    @click="onCompleteSecondStep"
                    :loading="loading"
                    :disabled="!validNickname || loading"
                  >
                    Continue
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card>
                <v-img
                :src="imageSrc"
                v-if="imageSrc">
                </v-img>
                <v-btn
                  class="white--text mb-3"
                  color="primary"
                  @click="triggerUpload"
                >Upload preview
                  <v-icon right dark>cloud_upload</v-icon>
                </v-btn>
                <input
                  ref="fileInput"
                  type="file"
                  style="display: none;"
                  accept="image/*"
                  @change="onFileChange"
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    @click="onSubmit"
                    :loading="loading"
                    :disabled="!validNickname || loading"
                  >
                    Submit!
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

          </v-stepper-items>
        </v-stepper>


      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data() {
      return {
        email: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        image: null,
        imageSrc: '',
        nicknameRules: [
          v => !!v || 'Nickname is required',
          v => (v && v.length >= 4) || 'Nickname must be equal or more than 4 characters',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 6) || 'Password must be equal or more than 6 characters',
        ],
        confirmPasswordRules: [
          v => !!v || 'Password is required',
          v => v === this.password || 'Password should match',
        ],
        valid: true,
        validNickname: true,
        step: '',
      };
    },
    computed: {
      loading() {
        return this.$store.getters.loading;
      },
    },
    methods: {
      onCompleteFirstStep() {
        if (this.$refs.form.validate()) {
          this.$store.dispatch('checkOnAvailable', { field: 'username', value: this.email })
            .then(() => {
              this.step = 2;
            })
            .catch(() => {});
        }
      },
      onCompleteSecondStep() {
        if (this.$refs.formNickname.validate()) {
          this.$store.dispatch('checkOnAvailable', { field: 'nickname', value: this.nickname })
            .then(() => {
              this.step = 3;
            })
            .catch(() => {});
        }
      },

      onSubmit() {
        const user = {
          email: this.email,
          password: this.password,
          nickname: this.nickname,
          image: this.image };
        this.$store.dispatch('registerUser', user)
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
  };
</script>

<style scoped>

</style>

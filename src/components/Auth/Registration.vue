<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6 lg5 xl4>

        <v-stepper v-model="step" alt-labels>
          <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1">{{$vuetify.t('$vuetify.regStep.step1')}}</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="step > 2" step="2">{{$vuetify.t('$vuetify.regStep.step2')}}</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">{{$vuetify.t('$vuetify.regStep.step3')}}</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>

            <v-stepper-content step="1">
              <v-card>
                <v-card-text>
                  <v-form v-model="valid" ref="form" lazy-validation>
                    <v-text-field
                      prepend-icon="person"
                      name="email"
                      :label="$vuetify.t('$vuetify.field.email')"
                      type="email"
                      v-model="email"
                      :rules="emailRules"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="lock"
                      name="password"
                      :label="$vuetify.t('$vuetify.field.password')"
                      type="password"
                      v-model="password"
                      :rules="passwordRules"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="lock"
                      name="confirm-password"
                      :label="$vuetify.t('$vuetify.field.confirmPassword')"
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
                    {{$vuetify.t('$vuetify.btn.continue')}}
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
                      :label="$vuetify.t('$vuetify.field.nickname')"
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
                    {{$vuetify.t('$vuetify.btn.continue')}}
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
                >{{$vuetify.t('$vuetify.btn.uploadAvatar')}}
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
                    {{$vuetify.t('$vuetify.btn.submit')}}
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
          v => !!v || this.$vuetify.t('$vuetify.rules.emailRequired'),
          v => /.+@.+/.test(v) || this.$vuetify.t('$vuetify.rules.emailValid'),
        ],
        image: null,
        imageSrc: '',
        nicknameRules: [
          v => !!v || this.$vuetify.t('$vuetify.rules.nicknameRequired'),
          v => (v && v.length >= 4) || this.$vuetify.t('$vuetify.rules.nicknameLength'),
        ],
        passwordRules: [
          v => !!v || this.$vuetify.t('$vuetify.rules.passwordRequired'),
          v => (v && v.length >= 6) || this.$vuetify.t('$vuetify.rules.passwordLength'),
        ],
        confirmPasswordRules: [
          v => !!v || this.$vuetify.t('$vuetify.rules.passwordRequired'),
          v => v === this.password || this.$vuetify.t('$vuetify.rules.passwordMatch'),
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

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
              <v-card class="elevation-12">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>Registration form</v-toolbar-title>
                </v-toolbar>
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
                    @click="onSubmit"
                    :loading="loading"
                    :disabled="!valid || loading"
                  >Create Account</v-btn>
                </v-card-actions>
              </v-card>

              <v-btn
                color="primary"
                @click="onCompleteFirstStep"
              >
                Continue
              </v-btn>

              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card
                class="mb-5"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn
                color="primary"
                @click="step = 3"
              >
                Continue
              </v-btn>

              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card
                class="mb-5"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn
                color="primary"
                @click="step = 1"
              >
                Continue
              </v-btn>

              <v-btn flat>Cancel</v-btn>
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
        password: '',
        confirmPassword: '',
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid',
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
          window.console.log('ff');
        }
      },
      onSubmit() {
        if (this.$refs.form.validate()) {
          const user = { email: this.email, password: this.password };
          this.$store.dispatch('registerUser', user)
            .then(() => this.$router.push('/'))
            .catch(() => {});
        }
      },
    },
  };
</script>

<style scoped>

</style>

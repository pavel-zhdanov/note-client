<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6 lg4 xl3>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>{{$vuetify.t('$vuetify.form.login')}}</v-toolbar-title>
          </v-toolbar>
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
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="onSubmit"
              :disabled="!valid || loading"
              :loading="loading"
            >{{$vuetify.t('$vuetify.btn.login')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  /* eslint-disable dot-notation */

  export default {
    data() {
      return {
        email: '',
        password: '',
        emailRules: [
          v => !!v || this.$vuetify.t('$vuetify.rules.emailRequired'),
          v => /.+@.+/.test(v) || this.$vuetify.t('$vuetify.rules.emailValid'),
        ],
        passwordRules: [
          v => !!v || this.$vuetify.t('$vuetify.rules.passwordRequired'),
          v => (v && v.length >= 6) || this.$vuetify.t('$vuetify.rules.passwordLength'),
        ],
        valid: true,
      };
    },
    computed: {
      loading() {
        return this.$store.getters.loading;
      },
    },
    methods: {
      onSubmit() {
        if (this.$refs.form.validate()) {
          const user = { email: this.email, password: this.password };
          this.$store.dispatch('loginUser', user)
            .then(() => this.$router.push('/'))
            .catch(e => window.console.error(e));
        }
      },
    },
    created() {
      if (this.$route.query['loginError']) {
        this.$store.dispatch('setError', 'Please log in to access this page');
      }
    },
  };
</script>

<style scoped>

</style>

<template>
  <v-app>

    <v-navigation-drawer
      app
      temporary
      v-model="drawer">
      <v-list>

        <v-list-tile
          v-for="link of links"
          :key="link.title"
          :to="link.url">
          <v-list-tile-action>
            <v-icon>{{link.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="link.title"></v-list-tile-title>
            <v-list-tile-sub-title v-if="(link.title === 'Profile')" v-text="user.email"></v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          @click="onLogout"
          v-if="isUserLoggedIn"
        >
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="$vuetify.t('$vuetify.navLinks.logout')"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <v-toolbar app dark color="primary">
      <v-toolbar-side-icon
      @click="drawer=!drawer"
      class="hidden-md-and-up"
      ></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" class="pointer">{{$vuetify.t('$vuetify.appName')}}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>




      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu offset-y>


          <v-btn
            slot="activator"
            flat
          >
            <v-img
              height="26"
              contain
              :src="currentLocaleIcon">
            </v-img>

          </v-btn>

          <v-list>
            <v-list-tile
              v-for="(item, index) in lang"
              :key="index"
              @click="onChangeLang(item)"
            >
              <v-img
                width="24"
                :src="item.icon"
                class="mr-3"
              ></v-img>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>

        <v-btn
          flat
          v-for="link of links"
          :key="link.title"
          :to="link.url"
        >
          <v-icon left>{{link.icon}}</v-icon>
          {{link.title}}</v-btn>

        <v-btn
          flat
          @click="onLogout"
          v-if="isUserLoggedIn"
        >
          <v-icon left>exit_to_app</v-icon>
          {{$vuetify.t('$vuetify.navLinks.logout')}}
        </v-btn>

      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <template v-if="error">
      <v-snackbar
        :multi-line="true"
        :timeout="5000"
        @input="closeError"
        color="error"
        :value="true"
      >
        {{error}}
        <v-btn
          dark
          flat
          @click.native="closeError"
        >Close</v-btn>
      </v-snackbar>
    </template>

  </v-app>
</template>
<script>
  export default {
    data() {
      return {
        drawer: false,
        lang: [
          { title: 'English', icon: 'https://cdn.vuetifyjs.com/images/flags/us.png', locale: 'en' },
          { title: 'Русский', icon: 'https://cdn.vuetifyjs.com/images/flags/ru.png', locale: 'ru' },
        ],
      };
    },
    computed: {
      error() {
        return this.$store.getters.error;
      },
      isUserLoggedIn() {
        return this.$store.getters.isUserLoggedIn;
      },
      user() {
        return this.$store.getters.user;
      },
      links() {
        if (this.isUserLoggedIn) {
          window.console.log(this.$vuetify.lang.current);
          return [
            { title: this.$vuetify.t('$vuetify.navLinks.profile'), icon: 'account_box', url: '/user' },
            { title: this.$vuetify.t('$vuetify.navLinks.newNote'), icon: 'note_add', url: '/new' },
            { title: this.$vuetify.t('$vuetify.navLinks.myNotes'), icon: 'list', url: '/list' },
            { title: this.$vuetify.t('$vuetify.navLinks.chat'), icon: 'chat', url: '/chat' },
          ];
        }
        return [
          { title: this.$vuetify.t('$vuetify.navLinks.registration'), icon: 'face', url: '/registration' },
          { title: this.$vuetify.t('$vuetify.navLinks.login'), icon: 'lock', url: '/login' },
        ];
      },
      currentLocaleIcon() {
        const locale = this.$vuetify.lang.current;
        return this.lang.find((item => item.locale === locale)).icon;
      },
    },
    methods: {
      closeError() {
        this.$store.dispatch('clearError');
      },
      onLogout() {
        this.$store.dispatch('logoutUser');
        this.$router.push('/');
      },
      onChangeLang(item) {
        this.$vuetify.lang.current = item.locale;
      },
    },
  };
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }
</style>

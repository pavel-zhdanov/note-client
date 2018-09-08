<template>
  <v-container>

    <v-layout
      v-for="(item, index) in messages"
      :key="item.createAt"
      justify-center>
      <v-flex xs12 sm6>
        <v-card flat tile>
          <v-layout row>
          <v-flex xs1>
            <v-avatar
              size="50px"
              color="grey lighten-4"
              v-if="!isAMultyMsg(index)"
            >
              <v-img
                :src="item.avatarSrc"
                alt="avatar"
              >
              </v-img>
            </v-avatar>
          </v-flex>
          <v-flex xs11>
            <v-card-text class="pa-1 ma-0" style="word-wrap: break-word">
              <span v-if="!isAMultyMsg(index)" class="subheading primary--text font-weight-bold">{{item.user}}</span>
              <span v-if="!isAMultyMsg(index)" class="secondary--text">{{item.date.getHours()}}:{{item.date.getMinutes()}}</span>
              <p class="pa-0 ma-0">{{item.message}}</p>
            </v-card-text>
          </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-footer app :height="footerHeight" color="white">
      <v-layout row wrap>
        <v-flex xs12 sm6 offset-sm3 pa-5>
          <v-text-field
            v-model="message"
            append-outer-icon="send"
            append-icon="vpn_key"
            clearable
            label="Message"
            type="text"
            @click:append-outer="sendMessage"
            @click:append="inputKey"
            @keyup.enter="sendMessage"
          ></v-text-field>
          <v-text-field
            class="mr-4"
            v-if="onInputKeyFlag"
            v-model="key"
            label="Key"
            type="text"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-footer>

  </v-container>
</template>

<script>
  /* eslint-disable no-unused-expressions */
  import coder from '../../util/coder';

  export default {
    data() {
      return {
        isConnected: false,
        message: '',
        messages: [],
        footerHeight: '60px',
        onInputKeyFlag: false,
        key: '',
      };
    },
    computed: {
      user() {
        return this.$store.getters.user;
      },
    },
    sockets: {
      connect() {
        this.isConnected = true;
      },
      disconnect() {
        this.isConnected = false;
      },
      MESSAGE(data) {
        const msg = data;
        msg.date = new Date(msg.createAt);
        if (msg.message.indexOf('U2FsdGVkX1') !== -1) {
          if (this.key.length > 0) {
            msg.message = coder.decode(data.message, this.key);
          } else {
            return;
          }
        }
        if (msg.message.length > 0) {
          this.messages.push(msg);
        }
      },
    },
    methods: {
      pingServer() {
        // Send the "pingServer" event to the server.
        this.$socket.emit('pingServer', 'PING!');
      },
      sendMessage() {
        if (this.message.length > 0) {
          if (this.key.length > 0) {
            this.message = coder.encode(this.message, this.key);
          }
          const now = new Date();
          this.$socket.emit('SEND_MESSAGE', {
            createAt: now.getTime(),
            user: this.user.nickname,
            message: this.message,
            avatarSrc: this.user.avatarSrc,
          });
          this.message = '';
        }
      },
      inputKey() {
        this.onInputKeyFlag = !this.onInputKeyFlag;
        this.onInputKeyFlag ? this.footerHeight = '120px' : this.footerHeight = '60px';
      },
      isAMultyMsg(index) {
        if (index < 1) {
          return false;
        }
        return this.messages[index].user === this.messages[index - 1].user;
      },
    },
    updated() {
      if (window.pageYOffset) {
        const scrollToEnd = document.body.offsetHeight - document.documentElement.clientHeight;
        window.scrollTo(0, scrollToEnd);
      }
    },
  };
</script>

<style scoped>

</style>

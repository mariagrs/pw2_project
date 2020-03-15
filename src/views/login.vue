<template>
  <v-card
    color="grey lighten-4"
    flat
    height="100%"
    width="100%"
    tile
  >
    <div>
      <v-toolbar dense>
        <v-toolbar-title>Hephaïstos</v-toolbar-title>
      </v-toolbar>

      <v-form>
        <v-row
              align="center"
              justify="center"
        >

          <v-col cols="12" sm="6">

            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              :rules="pwdRules"
              :type="show ? 'text' : 'password'"
            ></v-text-field>
            <v-card-actions class="justify-center">
            <v-btn
              :disabled="!valid"
              color="dark"
              class="mr-4"
              @click="triggerLogin"
            >
              Login
            </v-btn>
            </v-card-actions>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-card>
</template>

<script>
// import store from '../store'
import { mapActions } from 'vuex'

export default {
  name: 'login',
  data: () => ({
    email: '',
    password: '',
    valid: true,
    show: false,
    pwdRules: [
      v => !!v || 'password is required'
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  }),
  methods: {
    ...mapActions('user', ['login']),
    async triggerLogin () {
      try {
        await this.login({
          email: this.email,
          password: this.password
        })
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<template>
  <v-app id="example-2" toolbar>
    <v-navigation-drawer
      temporary
      v-model="drawer"
      :mini-variant.sync="mini"
      light
      overflow
      absolute
    >
      <v-list class="pa-1">
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <!--img src="https://randomuser.me/api/portraits/men/85.jpg" /-->
            <img v-if="isLoggedIn != false" :src="userDetail.photoURL" >
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <span v-if="isLoggedIn != false">{{userDetail.displayName}}</span>
              <span v-else class="notLoggedIn">You are Not Logged In</span>
            </v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon dark @click.native.stop="mini = !mini">
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense >
        <v-divider></v-divider>

        <v-list-tile v-show="isLoggedIn">
          <v-list-tile-action>

              <!--icon here -->
              <img v-show="isLoggedIn" src="https://png.icons8.com/exit/ios7/25"
                title="Exit" width="16" height="16">

          </v-list-tile-action>
          <v-list-tile-content >


              <!--v-list-tile-title @click="fbLogIn" v-show="!isLoggedIn"
                class="logInBut">Log In</v-list-tile-title-->
              <v-list-tile-title @click="fbLogOut"
                class="logOutBut">Log Out</v-list-tile-title>

          </v-list-tile-content>
        </v-list-tile>

        <v-layout row>
          <v-flex xs8 offset-xs2>
            <v-btn transparent dark @click="fbLogIn" v-show="!isLoggedIn"
              class="logInBut"><img src="https://png.icons8.com/facebook/color/24"
               title="Facebook" width="24" height="24">Sign In with Facebook
            </v-btn>
          </v-flex>
        </v-layout>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="deep-orange" dark>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="app-title">VOICE OF NATION</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid class="app-container">
        <!--div class="title">Click on sidebar to re-open.</div-->
        <!--v-router-->
        <router-view></router-view>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import Firebase from 'firebase'
import {mapGetters} from 'vuex'
import {mapMutations} from 'vuex'

var vm ;

Firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("// User is signed in.")
    vm.$store.state.isLoggedIn = true

    // The signed-in user info
    /*console.log(user)
    console.log(user.uid)
    console.log(user.email)
    console.log(user.displayName)
    console.log(user.photoURL)*/

    vm.$store.state.userDetail=user
    //console.log(vm.$store.state.userDetail)

  } else {
    console.log("// No user is signed in.")
    vm.$store.state.isLoggedIn = false
  }
});

export default {
  name: 'app',
  data(){
    return {
      drawer: null,
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ],
        mini: false,
        right: null
    }
  },
  methods:{
    ...mapMutations([
      'fbLogIn','fbLogOut'
    ])
  },
  computed:{
    ...mapGetters([
      'isLoggedIn','userDetail'
    ])
  },
  mounted(){
    vm = this
    //console.log(this.$store.state.userDetail.displayName)
  }
}
</script>

<style>


</style>

import Vue from 'vue'
import Vuex from 'vuex'
import Firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state:{
    isLoggedIn : false,
    userDetail : {},
    redirect : true
  },
  getters:{
    isLoggedIn: state =>{
      return state.isLoggedIn
    },
    userDetail: state=>{
      return state.userDetail
    }
  },
  mutations : {
    fbLogIn(){
      var provider = new Firebase.auth.FacebookAuthProvider()
      Firebase.auth().signInWithRedirect(provider)
      Firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          var token = result.credential.accessToken;
          console.log(token);
          // ...
        }
        // The signed-in user info.
        var user = result.user;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      })
    },
    fbLogOut(){
      Firebase.auth().signOut().then(function() {
      // Sign-out successful.
      }).catch(function(error) {
      // An error happened.
      });
    }
  }
})

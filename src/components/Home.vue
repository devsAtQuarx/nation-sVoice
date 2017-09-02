<template>
  <span id="main-home">



  <v-btn fab dark class="feedback indigo" @click="scrollToTop()">
    <i class="material-icons">&#xE5CE;</i>
  </v-btn>

  <!-- TabComponent -->
  <v-tabs dark fixed centered id='home' v-if="news_arr.length >=2" >

    <!-- tab selector -->
    <v-tabs-bar slot="activators" class="cyan">
      <v-tabs-slider class="yellow"></v-tabs-slider>
      <v-tabs-item
        v-for="i in news_arr"
        :key="i.id"
        :href="'#tab-' + i.id"
      >
        {{ i.id }}
      </v-tabs-item>
    </v-tabs-bar>

    <!-- content -->
    <v-tabs-content
      v-for="i in news_arr"
      :key="i.id"
      :id="'tab-' + i.id"
    >
    <v-layout v-for="j in i.articles" >
     <v-flex xs12 sm8 offset-sm2 >
      <v-card >
        <v-card-media :src="j.a.urlToImage" height="300px">
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{j.a.title}}</h3>
            <div>
              <span class="true-value-count" v-if="j.trueCountValue!=null">
                <v-chip outline class="grey black--text chip-auth">
                  Authenticated by
                  <span class="trueCountText">
                    {{j.trueCountValue}}
                  </span>
                </v-chip>
              </span>
              <br>
              {{j.a.description}}
            </div>

            <!-- computed, doesnot reflect anything on dom, work from behind -->
            <span>{{queryTrueCount}}</span>

         </div>
       </v-card-title>
        <v-card-actions>
          <v-btn
            :loading="loading3"
            @click.native.stop="loader = 'loading3';dialog = true;
              trueCount(i.id, j.k)"
            :disabled="loading3"
            class="primary dark white--text auth_but"
            :class="j.isTrueStatusInDb"
          >
            <span v-if="j.isTrueStatusInDb=='grey'">

              Authenticate
              <i class="material-icons thmb-icon" >&#xE8DC;</i>
            </span>
            <span v-if="j.isTrueStatusInDb=='blue'">

              Authenticated by You
              <i class="material-icons thmb-icon" >&#xE8DC;</i>
            </span>

          </v-btn>

          <v-btn flat class="orange--text auth_but" :href="j.a.url" >
            See Detail
            <i class="material-icons">&#xE315;</i>
          </v-btn>
        </v-card-actions>



      </v-card>
      <br>

     </v-flex>
    </v-layout>
    <v-btn block secondary dark v-show="i.id=='top'"
      @click="loadMore(i.id, i.articles[c].k); c+=3" class="load-more-but">
      <span  >
        Load More ...
      </span>
    </v-btn>

    <v-btn block secondary dark v-show="i.id=='latest'"
      @click="loadMore(i.id, i.articles[c2].k); c2+=3" class="load-more-but">
      <span  >
        Load More ...
      </span>
    </v-btn>

   </v-tabs-content>

    <!-- Dialog-->
    <v-dialog v-model="dialog" v-if="!isLoggedIn">
      <v-card>
        <v-card-title class="headline headline-dialog dialog-header-home">
          You are not LoggedIn !
        </v-card-title>
        <v-card-text>

        <v-layout row>
          <v-flex xs10 offset-xs1>
            <v-btn transparent dark @click.native="dialog = false;fbLogIn()" v-show="!isLoggedIn"
              class="logInBut"><img src="https://png.icons8.com/facebook/color/24"
               title="Facebook" width="24" height="24">Sign In with Facebook
            </v-btn>
          </v-flex>
        </v-layout>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="grey--text darken-1"
            flat="flat" @click.native="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-tabs>
  </span>
</template>

<script>
import {db} from '../firebase'
import {mapMutations} from 'vuex'
import {mapGetters} from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      news_arr : [],
      c: 0,
      c2: 0,
      dialog: false,
      loader: null,
      loading3: false,
    }
  },
  methods:{
    ...mapMutations([
      'fbLogIn','fbLogOut'
    ]),
    scrollToTop(){
      window.scrollTo(0, 0)
    },
    getNews(){
      //TopNews
      this.$http.get('https://newsapi.org/v1/articles?source=the-times-of-india&sortBy=top&apiKey=b0a290260ac4478c98e35da0f5ca7d4a')
      .then(response=>{
        let topNews = response.body
        //console.log(topNews)

        //extract news & save in firebase
        let top = []
        for(let i in topNews.articles){
          //console.log(topNews.articles[i])
          //console.log(topNews.articles[i].title)
          top.push(topNews.articles[i])

          //fetch id
          //console.log(topNews.articles[i].url.lastIndexOf('/'))
          //console.log(topNews.articles[i].url.lastIndexOf('.'))
          //console.log(topNews.articles[i].url.slice(topNews.articles[i].url.lastIndexOf('/')+1,
            //topNews.articles[i].url.lastIndexOf('.')))

          //firebase set
          if(topNews.articles[i].url.lastIndexOf('.cms')!=-1){
            db.ref('top/' + topNews.articles[i].url.slice(topNews.articles[i].url.lastIndexOf('/')+1,
              topNews.articles[i].url.lastIndexOf('.'))).set(topNews.articles[i])
          }
        }

        //retrieveTop
        this.retrieveTop()


        //LatestNews
        this.$http.get('https://newsapi.org/v1/articles?source=the-times-of-india&sortBy=latest&apiKey=b0a290260ac4478c98e35da0f5ca7d4a')
        .then(response=>{
          let latestNews = response.body
          //console.log(latestNews)

          //extract news & save in firebase
          let latest = []
          for(let i in latestNews.articles){
            //console.log(latestNews.articles[i])
            //console.log(latestNews.articles[i].title)
            latest.push(latestNews.articles[i])

            //fetch id
            //console.log(latestNews.articles[i].url.lastIndexOf('/'))
            //console.log(latestNews.articles[i].url.lastIndexOf('.'))
            //console.log(latestNews.articles[i].url.slice(latestNews.articles[i].url.lastIndexOf('/')+1,
              //latestNews.articles[i].url.lastIndexOf('.')))
            //console.log(latestNews.articles[i].url.lastIndexOf('.cms'))

            //firebase set
            if(latestNews.articles[i].url.lastIndexOf('.cms')!=-1){
              //console.log(latestNews.articles[i].url.lastIndexOf('.cms'))
              db.ref('latest/' + latestNews.articles[i].url.slice(latestNews.articles[i].url.lastIndexOf('/')+1,
                latestNews.articles[i].url.lastIndexOf('.'))).set(latestNews.articles[i])
            }
          }

          //retrievLatest
          this.retrieveLatest()

        })


      })

    },
    retrieveTop(){

      let vm =this

      //retriev from firebase
      let topArr = []
      db.ref('top/').limitToLast(3).once('value',function(snapshot){
        //console.log(snapshot.val())
        //console.log(Object.keys(snapshot.val()))

        //console.log(k)
        for(let k in snapshot.val()){

          //console.log(snapshot.val()[k])
          let a = snapshot.val()[k]

          //isTrueStatus
          let isTrueStatusInDb
          db.ref('trueCount/'+k+'/'+vm.$store.state.userDetail.uid).once('value',
            function(snapshot2){
              //console.log(k + ": "+snapshot2.val())

              //isTrueStatus
              if(snapshot2.val() != null){
                isTrueStatusInDb = 'blue'
              }else{
                isTrueStatusInDb = 'grey'
              }
              //console.log(k)

              //pack
              let topObj = {
                k,
                a,
                isTrueStatusInDb
              }
              //console.log(topObj)
              topArr.push(topObj)
          })
        }

      })

      // packing for dom
      let top_obj = {
        id : "top",
        articles : topArr
      }

      this.news_arr.push(top_obj) //dom arr

    },
    retrieveLatest(){

      let vm =this

      //retriev from firebase
      let latestArr = []
      db.ref('latest/').limitToLast(3).once('value',function(snapshot){
        //console.log(snapshot.val())
        //console.log(Object.keys(snapshot.val()))

        for(let k in snapshot.val()){
          //console.log(snapshot.val()[k])
          let a = snapshot.val()[k]

          //isTrueStatus
          let isTrueStatusInDb
          db.ref('trueCount/'+k+'/'+vm.$store.state.userDetail.uid).once('value',
            function(snapshot2){
              //console.log(k + ": "+snapshot2.val())

              //isTrueStatus
              if(snapshot2.val() != null){
                isTrueStatusInDb = 'blue'
              }else{
                isTrueStatusInDb = 'grey'
              }
              //console.log(k)

              //pack
              let latestObj = {
                k,
                a,
                isTrueStatusInDb
              }

              //push
              latestArr.push(latestObj)
          })
        }

      })

      // packing for dom
      let latest_obj = {
        id : "latest",
        articles : latestArr
      }

      this.news_arr.push(latest_obj) //dom arr

    },
    trueCount(newsType ,k){
      console.log(k)
      console.log(newsType)
      let vm = this

      if(this.$store.state.isLoggedIn == true){
        //console.log("close")
        this.dialog = false

        //increase True Count
        console.log(this.$store.state.userDetail.uid)


        //before push , check id in Db
        db.ref('trueCount/' + '/' + k + '/' +
          vm.$store.state.userDetail.uid).once('value',function(snapshot){
            console.log(snapshot.val())

            //if uid is not in Db
            if(snapshot.val() == null){ //no there , Add

              console.log("Add")
              let trueCountInDb
              db.ref('trueCount/' + '/' + k + '/' + 'trueCountNo').once('value', function(snapshot){
                console.log("True Count No: "+snapshot.val())

                //if there is atleast 1 comment
                if(snapshot.val() != null ){
                    trueCountInDb = snapshot.val() + 1
                }else{  // if null
                  trueCountInDb = 1
                }

                //push uid in Db
                db.ref('trueCount/' + '/' + k + '/' +
                    vm.$store.state.userDetail.uid).set(vm.$store.state.userDetail.displayName)

                //push count
                db.ref('trueCount/' + '/' + k + '/' +
                    'trueCountNo').set(trueCountInDb)

                //trueButtonColorBlue
                for(let z in vm.news_arr){
                  //console.log(vm.news_arr[z]) //2 -> top & latest
                  for(let z1 in vm.news_arr[z].articles){
                    //console.log(vm.news_arr[z].articles[z1])
                    if(vm.news_arr[z].articles[z1].k == k){
                      //console.log(k +":" vm.news_arr[z].articles[z1].isTrueStatusInDb)
                      if(vm.news_arr[z].articles[z1].isTrueStatusInDb == 'grey'){
                        vm.news_arr[z].articles[z1].isTrueStatusInDb = 'blue'
                      }else if(vm.news_arr[z].articles[z1].isTrueStatusInDb == 'blue'){
                        vm.news_arr[z].articles[z1].isTrueStatusInDb = 'grey'
                      }
                    }
                  }
                }

              })

            }else{ //already there , Remove
              console.log("Remove")

                //remove Uid
                db.ref('trueCount/' + '/' + k + '/' +
                  vm.$store.state.userDetail.uid).remove()
                  .then(function(){

                  let trueCountInDb
                  db.ref('trueCount/' + '/' + k + '/' + 'trueCountNo').once('value', function(snapshot){
                    console.log("True Count No: "+snapshot.val())
                    trueCountInDb = snapshot.val() - 1

                    // count --
                    db.ref('trueCount/' + '/' + k + '/' +
                        'trueCountNo').set(trueCountInDb)

                    //trueButtonColorGrey
                    for(let z in vm.news_arr){
                      //console.log(vm.news_arr[z]) //2 -> top & latest
                      for(let z1 in vm.news_arr[z].articles){
                        //console.log(vm.news_arr[z].articles[z1])
                        if(vm.news_arr[z].articles[z1].k == k){
                          //console.log(k +":" vm.news_arr[z].articles[z1].isTrueStatusInDb)
                          if(vm.news_arr[z].articles[z1].isTrueStatusInDb == 'grey'){
                            vm.news_arr[z].articles[z1].isTrueStatusInDb = 'blue'
                          }else if(vm.news_arr[z].articles[z1].isTrueStatusInDb == 'blue'){
                            vm.news_arr[z].articles[z1].isTrueStatusInDb = 'grey'
                          }
                        }
                      }
                    }

                  })
                })
            }
        })
      }

    },
    loadMore(id, k){
      //console.log(id)
      if(id == 'top'){
        //console.log("top")
        console.log(k)
        this.loadMoreTop(k)
      }else if(id == 'latest'){
        //console.log("latest")
        this.loadMoreLatest(k)
      }
    },
    loadMoreTop(key){
      //retriev from firebase
      console.log(key)
      //console.log(this)
      let vueRef=this
      db.ref('top/').orderByKey().endAt(key).limitToLast(4).on('value',function(snapshot){
        //console.log(snapshot.val())
        //console.log(Object.keys(snapshot.val()))

        for(let k2 in snapshot.val()){
          //console.log(snapshot.val()[k2])
          if(key==k2)
            break
          let a = snapshot.val()[k2]

          //isTrueStatus
          let isTrueStatusInDb
          db.ref('trueCount/'+k2+'/'+vueRef.$store.state.userDetail.uid).once('value',
            function(snapshot2){
              //console.log(k2 + ": "+snapshot2.val())

              //isTrueStatus
              if(snapshot2.val() != null){
                isTrueStatusInDb = 'blue'
              }else{
                isTrueStatusInDb = 'grey'
              }
              //console.log(k2)

              //pack
              let topObj = {
                k:k2,
                a,
                isTrueStatusInDb
              }
              //console.log(topObj)
              //console.log(vueRef.news_arr)
              vueRef.news_arr[0].articles.push(topObj)
          })

        }
      })
    },
    loadMoreLatest(key){
      //retriev from firebase
      console.log(key)
      //console.log(this)
      let vueRef=this
      db.ref('latest/').orderByKey().endAt(key).limitToLast(4).on('value',function(snapshot){
        //console.log(snapshot.val())
        //console.log(Object.keys(snapshot.val()))

        for(let k2 in snapshot.val()){
          if(key==k2)
            break
          console.log(k2)
          let a = snapshot.val()[k2]

          //isTrueStatus
          let isTrueStatusInDb
          db.ref('trueCount/'+k2+'/'+vueRef.$store.state.userDetail.uid).once('value',
            function(snapshot2){
              //console.log(k2 + ": "+snapshot2.val())

              //isTrueStatus
              if(snapshot2.val() != null){
                isTrueStatusInDb = 'blue'
              }else{
                isTrueStatusInDb = 'grey'
              }
              //console.log(k2)

              //pack
              let latestObj = {
                k:k2,
                a,
                isTrueStatusInDb
              }

              //push
              //console.log(vueRef.news_arr)
              vueRef.news_arr[1].articles.push(latestObj)
          })

        }

      })
    }
  },
  firebase: {

  },
  computed:{
    ...mapGetters([
      'isLoggedIn'
    ]),
    queryTrueCount(){
      let vm = this

      //trueButtonColorGrey
      for(let z in vm.news_arr){
        //console.log(vm.news_arr[z]) //2 -> top & latest
        for(let z1 in vm.news_arr[z].articles){
          //console.log(vm.news_arr[z].articles[z1])
          //console.log(vm.news_arr[z].articles[z1].k)
          db.ref('trueCount/'+vm.news_arr[z].articles[z1].k+'/'+
            'trueCountNo').on('value',function(snapshot){
            //console.log(vm.news_arr[z].articles[z1].k+ " " +snapshot.val())
            let trueCountValue = snapshot.val()
            if(trueCountValue == null)
              trueCountValue = 0
            vm.news_arr[z].articles[z1].trueCountValue = trueCountValue //**Print
            console.log(vm.news_arr[z].articles[z1].trueCountValue)
          })
        }
      }
      //console.log("**************************")
      return
    }
  },
  beforeMount(){
    this.getNews()
    setTimeout(() => (this.dialog =! this.dialog), 7000)

  },
  mounted(){

  },
  watch: {
    loader () {
      const l = this.loader
      this[l] = !this[l]
      setTimeout(() => (this[l] = false), 1000)
      this.loader = null
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.title{
  font-size:20px;
}
.logInBut{
  margin-top:-3%;
  font-size:12px;
  text-transform: inherit;
  height:24px;
  margin-left:13%;
}
.logInBut >.btn__content{
  padding:0 8px 0px 3px;
  background:#3F51B5;
}
.headline-dialog{
  font-size:14px ! important;
}
.dialog-header-home{
  margin-left:20%;
}
.layout .flex {
    padding-right: 0px;
    padding-left: 0px;
}
.load-more-but{
  height:28px;
  text-transform: inherit;
}
.auth_but{
  font-size:12px;
  text-transform: inherit;
    height: 30px;
}
.true-value-count{

  width:18px;
  height:18px;

  border-radius:50px;
  margin-right:5px;
}
.trueCountText{
  color:green;
  margin-left:5px;
}
.chip-auth{
    margin: 8px 0px;
}
.thmb-icon{
  font-size:12px;
}

.feedback {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index:10;
}



</style>

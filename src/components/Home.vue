<template>
  <div id="main-home" >

    <!-- TabComponent -->
    <v-tabs
    dark fixed centered id='home'
    v-if="showAllNews"
    >

      <!-- scrollToTop -->
      <v-btn fab dark class="feedback blue-grey" @click="scrollToTop()">
        <i class="material-icons">&#xE5CE;</i>
      </v-btn>

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
      <!-- main arr -> news_arr => 1)top 2)latest-->
      <v-tabs-content
        v-for="(i,index_new_arr) in news_arr"
        :key="i.id"
        :id="'tab-' + i.id"
        v-touch="{
          left: () => swipe('Left'),
          right: () => swipe('Right')
        }"
      >

        <!-- news cardd -->
        <v-layout v-for="(j,index_articles) in i.articles" >

          <v-flex xs12 sm8 offset-sm2 >
            <v-card>

              <!-- news photo -->
              <v-card-media :src="j.a.urlToImage" height="300px">
              </v-card-media>

              <!-- card body-->
              <v-card-title primary-title>
                <div>

                  <!-- news title-->
                  <h3 class="headline mb-0">
                    {{j.a.title}}
                  </h3>

                  <div>
                    <span class="true-value-count" v-if="j.trueCountValue!=null">
                        <v-chip outline class="grey secondary--text chip-auth">
                            Authenticated by
                            <span class="trueCountText">

                              <!-- authCount -->
                              {{j.trueCountValue}}

                            </span>
                        </v-chip>
                    </span>

                    <br>

                    <!-- news desc-->
                    {{j.a.description}}

                  </div>

                  <!-- computed, doesnot reflect anything on dom, work from behind -->
                  <!--span>{{queryTrueCount}}</span-->

                </div>
              </v-card-title>

              <v-divider></v-divider>
              <!--card footer-->
              <v-card-actions>

                <!-- auth but -->
                <v-btn
                  fab small dark

                  :loading="loading"

                  @click.native.stop=
                    "loader = 'loading';
                      dialog = true;
                      trueCount(i.id, j.k)"


                  class=""
                  :class="j.isTrueStatusInDb"
                >

                  <!-- show grey but -->
                  <v-icon
                    dark
                    v-if="j.isTrueStatusInDb=='grey'"
                    style="font-size:24px;font-weight:600">
                    check
                  </v-icon>

                  <!-- show blue but-->
                  <v-icon
                    dark
                    v-if="j.isTrueStatusInDb=='blue'"
                    style="font-size:24px;font-weight:600">
                    check
                  </v-icon>

                </v-btn>

                <v-spacer></v-spacer>
                <!--see detail button -->
                <v-btn flat class="orange--text seeDetail_but" :href="j.a.url" >
                  See Detail
                  <i class="material-icons" style="font-size:20px;margin-top:1px">&#xE315;</i>
                </v-btn>

              </v-card-actions>
            </v-card>

            <br><!-- space between cards -->

          </v-flex>
        </v-layout><!-- newscard ends -->

        <!-- load more but => top -->
        <v-btn block secondary dark
          v-show="i.id=='top'"
          :loading="loading3"
          @click.native="loader = 'loading3';loadMore(i.id, i.articles[c].k)"
          class="load-more-but"
        >
          <span  >
            Load More ...
          </span>
        </v-btn>


        <!-- load more but => latest -->
        <v-btn block secondary dark v-show="i.id=='latest'"
        :loading="loading3"
          @click.native="loader = 'loading3';loadMore(i.id, i.articles[c2].k);"
           class="load-more-but">
          <span  >
            Load More ...
          </span>
        </v-btn>

     </v-tabs-content><!-- tab content ends -->


      <!-- Dialog-->
      <v-dialog v-model="dialog" v-if="!isLoggedIn">
        <v-card>

          <!-- head/title dialog-->
          <v-card-title class="headline headline-dialog dialog-header-home">
            You are not LoggedIn !
          </v-card-title>

          <!-- dialog body -->
          <v-card-text>
          <v-layout row>
            <v-flex xs10 offset-xs1>

              <!-- fb but -->
              <v-btn transparent dark @click.native="dialog = false;fbLogIn()" v-show="!isLoggedIn"
                class="logInBut"><img src="https://png.icons8.com/facebook/color/24"
                 title="Facebook" width="24" height="24">Sign In with Facebook
              </v-btn>

            </v-flex>
          </v-layout>
          </v-card-text>

          <!-- dialog foot-->
          <v-card-actions>
            <v-spacer></v-spacer>

            <!-- close but-->
            <v-btn class="grey--text darken-1"
              flat="flat" @click.native="dialog = false">Close</v-btn>

          </v-card-actions>

        </v-card>
      </v-dialog>

    </v-tabs>


    <div class="preloader-init" v-else></div>

  </div>
</template>


<script>
import {db} from '../firebase'
import {mapMutations} from 'vuex'
import {mapGetters} from 'vuex'


export default {
  name: 'home',

  //data
  data () {
    return {
      news_arr : [], // main arr
      c: 0, //load more
      c2: 0,
      dialog: false,
      loader: null,
      loading: false,
      scroll_flg : false,
      loading3: false,
      showAllNews:true,
      swipeDirection: 'None'
    }
  },

  //methods
  methods:{

    //mapMutations
    ...mapMutations([
      'fbLogIn','fbLogOut'
    ]),

    //swipe - to be done later
    swipe (direction) {
      this.swipeDirection = direction
      //console.log(this.swipeDirection)

      if(this.swipeDirection == 'Left'){
        //console.log('left')

      }else if(this.swipeDirection == 'Right'){
        //console.log('right')

      }
    },

    //scrollToTop
    scrollToTop(){
      window.scrollTo(0, 0)
    },

    //getNews
    getNews(){

      let vm = this
      this.showAllNews = false

      //*************TopNews************/
      this.$http.get('https://newsapi.org/v1/articles?source=the-times-of-india&sortBy=top&apiKey=b0a290260ac4478c98e35da0f5ca7d4a')
      .then(response=>{
        let topNews = response.body
        //console.log(topNews)

        //extract news
        for(let i in topNews.articles){
          //console.log(topNews.articles[i])
          //console.log(topNews.articles[i].title)

          //fetch id
          //console.log(topNews.articles[i].url.lastIndexOf('/'))
          //console.log(topNews.articles[i].url.lastIndexOf('.'))
          //console.log(topNews.articles[i].url.slice(topNews.articles[i].url.lastIndexOf('/')+1,
            //topNews.articles[i].url.lastIndexOf('.')))

          //extract unique news no
          if(topNews.articles[i].url.lastIndexOf('.cms')!=-1){
            //firebase set in db
            db.ref('top/' + topNews.articles[i].url.slice(topNews.articles[i].url.lastIndexOf('/')+1,
              topNews.articles[i].url.lastIndexOf('.'))).set(topNews.articles[i])
          }
        }//for ends

        //retrieveTop
        this.retrieveTop()


        //************* LatestNews ***************/
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
          setTimeout(function(){ vm.showAllNews = true }, 3000);
        })


      })

    },

    //retrieveTop
    retrieveTop(){

      let vm =this

      //retriev from firebase
      let topArr = []
      db.ref('top/').limitToLast(3).once('value',function(snapshot){
        //console.log(snapshot.val())
        //console.log(Object.keys(snapshot.val()))

        //console.log(k)
        let c=0
        for(let k in snapshot.val()){
          c++
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

              //trueCount
              db.ref('trueCount/'+k+'/'+
                'trueCountNo').once('value',function(snapshot3){
                //console.log(vm.news_arr[z].articles[z1].k+ " " +snapshot.val())
                let trueCountValue = snapshot3.val()

                //logic
                if(trueCountValue == null)
                  trueCountValue = 0


                  //pack
                  let topObj = {
                    k,
                    a,
                    isTrueStatusInDb,
                    trueCountValue
                  }

                  //console.log(topObj)
                  topArr.push(topObj)

              })
          })
        }//for end

      })

      // packing for dom
      let top_obj = {
        id : "top",
        articles : topArr
      }

      this.news_arr.push(top_obj) //dom arr

    },

    //retrieveLatest
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

              //trueCount
              db.ref('trueCount/'+k+'/'+
                'trueCountNo').once('value',function(snapshot3){
                //console.log(vm.news_arr[z].articles[z1].k+ " " +snapshot.val())
                let trueCountValue = snapshot3.val()

                //logic
                if(trueCountValue == null)
                  trueCountValue = 0


                  //pack
                  let latestObj = {
                    k,
                    a,
                    isTrueStatusInDb,
                    trueCountValue
                  }

                  //push
                  latestArr.push(latestObj)

              })
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

    //true Count - auth
    trueCount(newsType ,k){
      //console.log(k)
      //console.log(newsType)
      let vm = this

      //if Logged in
      if(this.$store.state.isLoggedIn == true){
        //console.log("close")
        this.dialog = false

        //button preloader starts
        const l=this.loader
        this[l]=!this[l]

        //increase True Count
        //console.log(this.$store.state.userDetail.uid)


        /****** logic like *******/
        //check => if user like ? yes or no
          //yes) => A) old count - 1

          //no) => A)if count is null(means news id not in db) ??? yes or no
                        //a)yes -> count = 1
                        //b)no -> old count + 1


        //before push , check uid in Db
        db.ref('trueCount/' + '/' + k + '/' +
          vm.$store.state.userDetail.uid).once('value',function(snapshot){
            console.log(snapshot.val())

            //if uid is not in Db
            if(snapshot.val() == null){ //no there , Add

              //console.log("Add")
              let trueCountInDb
              db.ref('trueCount/' + '/' + k + '/' + 'trueCountNo').once('value',
                function(snapshot){ //get Old true count
                //console.log("True Count No: "+snapshot.val())

                //if there is atleast 1 like
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
                      vm.news_arr[z].articles[z1].trueCountValue = trueCountInDb

                      //button preloader ends
                      vm[l] = false
                      vm.loader = null
                    }
                  }
                }

              })

            }else{ //already there , Remove
              //console.log("Remove")

                //remove Uid
                db.ref('trueCount/' + '/' + k + '/' +
                  vm.$store.state.userDetail.uid).remove()
                  .then(function(){

                    let trueCountInDb
                    db.ref('trueCount/' + '/' + k + '/' + 'trueCountNo')
                    .once('value', function(snapshot){
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
                            vm.news_arr[z].articles[z1].trueCountValue = trueCountInDb

                            //button preloader ends
                            vm[l] = false
                            vm.loader = null
                          }
                        }
                      }

                  })
                })
            }
        })
      }else{
        //user is not logged in
      }

    },

    //load more
    loadMore(id, k){

      //console.log(id)
      if(id == 'top'){
        //console.log("top")
        //console.log(k)
        this.loadMoreTop(k)
        this.c+=3
      }else if(id == 'latest'){
        //console.log("latest")
        this.loadMoreLatest(k)
        this.c2+=3
      }
    },

    //loadMoreTop
    loadMoreTop(key){

      //
      const l = this.loader
      this[l] = !this[l]

      //retriev from firebase
      //console.log(key)
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

              //trueCount
              db.ref('trueCount/'+k2+'/'+
                'trueCountNo').once('value',function(snapshot3){
                //console.log(vm.news_arr[z].articles[z1].k+ " " +snapshot.val())
                let trueCountValue = snapshot3.val()

                //logic
                if(trueCountValue == null)
                  trueCountValue = 0

                //pack
                let topObj = {
                  k:k2,
                  a,
                  isTrueStatusInDb,
                  trueCountValue
                }
                //console.log(topObj)
                //console.log(vueRef.news_arr)
                vueRef.news_arr[0].articles.push(topObj)
                vueRef[l] = false
                vueRef.loader = null
            })
          })

        }
      })
    },

    //loadMoreLatest
    loadMoreLatest(key){

      //
      const l = this.loader
      this[l] = !this[l]

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

              //trueCount
              db.ref('trueCount/'+k2+'/'+
                'trueCountNo').once('value',function(snapshot3){
                //console.log(vm.news_arr[z].articles[z1].k+ " " +snapshot.val())
                let trueCountValue = snapshot3.val()

                //logic
                if(trueCountValue == null)
                  trueCountValue = 0

                //pack
                let latestObj = {
                  k:k2,
                  a,
                  isTrueStatusInDb,
                  trueCountValue
                }

                //push
                //console.log(vueRef.news_arr)
                vueRef.news_arr[1].articles.push(latestObj)
                vueRef[l] = false
                vueRef.loader = null
            })
          })

        }

      })
    },

  },

  //firebase
  firebase: {

  },


  //computed
  computed:{

    //mapGetters
    ...mapGetters([
      'isLoggedIn'
    ]),

  },

  //beforeMount
  beforeMount(){
    this.getNews()

  },

  //mounted
  mounted(){

  },

  //watch
/*  watch: {
    loader () {
      const l = this.loader
      console.log("l1=> " + l)

      console.log("this[l]1=> " + this[l])
      this[l] = !this[l]
      console.log("this[l]2=> " + this[l])

      setTimeout(() => (this[l] = false), 2000)
      console.log("this[l]3=> " + this[l])

      this.loader = null
      console.log("l2=> " + l)
    }
  },*/
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
  height:36px;
  text-transform: inherit;
  background: #546E7A!important;
  font-size: 13px;
  font-weight: 300;
}

.seeDetail_but{
  font-size:13px;
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
  color:#2196f3;
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

.preloader-init {
  position: absolute;
  top: 58%;
  left: 49%;
  width: 40px;
  height: 40px;
  margin: -42px 0 0 -12px;
  background: #616161;
  transform: rotate(45deg);
  animation: spin 1s infinite linear;
}

@keyframes spin {
	0% { -webkit-transform:rotate(0deg); }
	100% { -webkit-transform:rotate(360deg); }
}

</style>

<template>
  <div class="hello">
    <section class="hero is-medium is-primary">
      <div class="hero-body">
        <div class="columns" v-if="user_checked==false">
          <div class="column is-one-third">

            <h1 class="title is-size-2">
              Anonychat
            </h1>
            <h2 class="subtitle is-size-3">
              Enter Username
            </h2>

            <div class="box">
              <div class="field">
                <div class="control">
                  <input type="text" class="input" placeholder="Username" v-model="username">
                </div>
              </div>
              <div class="field">
                <a class="button is-primary" @click='check_user()'>Enter</a>
              </div>

            </div>
          </div>

        </div>

        <div class="columns is-centered" v-else>
          
          <div class="column is-one-third main" v-if="users !== null">
              <h1 class="title is-size-4">{{username}}</h1>
            <h1 class="title is-size-3">Users currently online</h1>
            <div class="box" v-for="user in users_filtered" @click="open_user(user)">
              <p>{{user}}</p>
            </div>
          </div>
          <div class="column is-two-thirds main" v-if="chat_open == true">
            <h1 class="title is-size-2">{{current_chat_name}}</h1>
            <div class="box">
              <div class="my-box " v-if="current_message" v-for="msg in current_message">


                <article class="message is-info is-pulled-right" v-if="msg.from == username">
                  <div class="message-header"> 
                    <p> {{msg.to}}</p>

                  </div>
                  <div class="message-body">
                    {{msg.msg}}
                  </div>
                </article>

                <article class="message is-success is-pulled-left" v-else>
                  <div class="message-header">
                    <p> {{msg.to}}</p>

                  </div>
                  <div class="message-body">
                    {{msg.msg}}
                  </div>
                </article>
              </div>
              <input type="text" class="input" placeholder="Message" v-model="chat_msg.message">
            </div>
            <a class="button is-info" @click="send_message()">Send</a>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        username:"",
        user_checked: false,
        users: null,
        chat_open: false,
        chat_msg: {},
        all_messages: null,
        current_chat: null,
        current_chat_name: null,
        messages: {},
        current_message: null
      }
    },
    methods: {

      check_user() {
        this.$socket.emit('new_user', this.username, (data) => {
          if (data) {
            this.user_checked = true;
            this.update_list
          }
        })
      },
      open_user(user) {
        this.chat_open = true;
        this.current_chat_name = user
        this.current_chat = this.users.id[user]
        this.$socket.emit('init_get_private_messages', {
          id: this.current_chat,
          name: this.current_chat_name
        })

      },

      send_message() {
        this.chat_msg.to = {
          id: this.current_chat,
          name: this.current_chat_name
        };
        this.$socket.emit('private_message', this.chat_msg);
        this.chat_msg = {}
      }

    },

    computed: {
      update_list() {
        this.$socket.on('usernames', (data) => {
          this.users = {
            id: data,
            name: Object.keys(data)
          }
        });
      },
      update_msg() {
        this.$socket.on('private_message', (data) => {
          this.current_message = data;
        })
        this.$socket.on('init_get_private_messages', (data) => {
          this.current_message = data;
        })
      },

      users_filtered(){
        const displayed_users = this.users.name.filter(user=>{
          if(user !== this.username){
            return user
          }
        })
        console.log(displayed_users,"ssk")
        return displayed_users;
      }
    },

    mounted() {
      this.update_list;
      this.update_msg;

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .my-box{
   display: block;
   height: 100px;
   margin-top: 20px; 
   margin-bottom:20px;
 }
 
</style>
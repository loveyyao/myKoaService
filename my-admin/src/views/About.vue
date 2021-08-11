<template>
  <div class="about">
    <el-input v-model="form.username"/>
    <el-input v-model="form.password"/>
    <el-button @click="login">登录</el-button>
    <h1>This is an about page</h1>
  </div>
</template>
<script>
  import { login } from '@/api/user'
  export default {
    name: 'About',
    data () {
      return {
        form: {
          username: 'admin',
          password: '123456'
        }
      }
    },
    methods: {
      login () {
        const params = {
          ...this.form
        }
        login(params).then(res => {
          console.log(res)
          this.$message.success(res.msg)
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
</script>

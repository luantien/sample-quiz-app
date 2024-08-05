<script>
import QuizRoom from './QuizRoom.vue';

export default {
    props: {
        socket: Object
    },
    data() {
        return {
            isCreateMode: false
        };
    },
    components: {
        QuizRoom
    },
    methods: {
        goToPlayMode() {
            this.$router.push('/play');
        },
        goToCreateMode() {
            this.isCreateMode = true;
        },
        backToHostView() {
            this.isCreateMode = false;
        }
    }
};
</script>

<template>
    <div>
        <div v-if="!isCreateMode" class="host-view card">
            <h2>Live Quiz App</h2>
            <div class="card-body home-text">
                <h5 class="card-title">Welcome Quiz Lovers!</h5>
                <p class="card-text">
                    You can host a live quiz or join to play with other participants. 
                    As the host, you'll be able to see the live stats at all times and
                    will have full control of the quiz during the live game.
                </p>
                <button class="btn" type="submit" @click="goToPlayMode()">
                    Join a room
                </button>
                <button class="btn" type="submit" @click="goToCreateMode()">
                    Create your room
                </button>
            </div>
            <div class="card-footer footer-black">
                2024 &copy; Live Quiz App
            </div>
        </div>
        <template v-if="isCreateMode">
            <QuizRoom 
                :backToHostView="backToHostView"
                :socket="socket"
            >
            </QuizRoom>
        </template>
    </div>
  </template>
  
<style scoped>
.host-view {
    padding: 20px 0 0 0;
    margin: 0px auto;
    text-align: center;
    width: 90%;
    max-width: 900px;
}
button {
    margin: 5px;
    width: 60%;
    font-size: 20px;
    background: rgb(47, 216, 157);
    border: 1px solid #ffffff;
    color: #ffffff;
}
button:hover {
    background: #ffffff;
    color: red;
    border: 1px solid red;
}
.footer-black {
    background-color: #03020d;
    color: #ffffff;
}
</style>
<script>
import OnlinePlayers from '../common/OnlinePlayers.vue';

export default {
    name: 'QuizRoom',
    props: {
        backToHostView: Function,
        socket: Object,
    },
    components: {
        OnlinePlayers
    },
    data() {
        return {
            createBtnSubmitted: false,
            isRoomReady: false,
            hostNickname: null,
            roomCode: this.generateRoomCode().toString(),
            onlinePlayers: [],
            didHostStartGame: false
        };
    },
    methods: {
        generateRoomCode() {
            return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        },
        createQuizRoom() {
            this.createBtnSubmitted = true;

            this.socket.emit('createRoom', {
                roomCode: this.roomCode,
                hostNickname: this.hostNickname,
            });
            this.socket.on('roomCreated', (data) => {
                this.isRoomReady = true;
            });
            this.socket.on('playerJoined', (data) => {
                this.onlinePlayers = data.onlinePlayers;
            });
            this.socket.on('playerLeft', (data) => {
                this.onlinePlayers = data.onlinePlayers;
            });
        },
        startQuiz() {
            console.log('Starting the quiz');
        },
    },
}
</script>


<template>
    <div>
        <div class="host-view card">
            <!--- Case: Room is not ready -->
            <div v-if="!isRoomReady" class="card-body">
                <h2 class="card-title">
                    Host a quiz
                </h2>
                <p class="card-text">
                    Your room code is: 
                    <div class="fs-2 orange-txt">
                        {{ roomCode }}
                    </div>
                </p>
                <p class="card-text">
                    How should others call you?
                </p>
                <input
                    class="form-control input-box"
                    placeholder="Enter a nickname"
                    v-model="hostNickname"
                    :disabled="createBtnSubmitted"
                    @keyup.enter="createQuizRoom()"
                />
                <button
                    type="button"
                    class="btn"
                    @click="createQuizRoom()"
                    :disabled="createBtnSubmitted"
                >
                   Join now!
                </button>
            </div>
            <!--- Case: Room is ready -->
            <div v-else class="card-body">
                <h2 class="card-title">Your quiz room is ready</h2>
                <p class="card-text">
                    Room code:
                    <div class="fs-2 orange-txt">
                        {{ roomCode }}
                    </div>
                </p>
                <p class="card-text">
                    Share this code with your friends to join the quiz
                </p>
                <hr />
                <OnlinePlayers :onlinePlayers="onlinePlayers"></OnlinePlayers>
                <template v-if="onlinePlayers.length > 0">
                    <div v-if="!didHostStartGame">
                        <hr />
                        <button type="button" class="btn" @click="startQuiz()">
                            Start the quiz
                        </button>
                    </div>
                </template>
            </div>
            <div class="card-footer div-black" v-if="!isRoomReady">
                <button type="button" class="btn back-btn" @click="backToHostView()">
                    &larr; Go back
                </button>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.host-view {
    margin: 0px auto;
    text-align: center;
}
.input-box {
    margin: 20px auto;
    text-align: center;
}
button {
    margin: 5px;
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
.back-btn {
    background: none;
    border: none;
    color: #ffffff;
    padding: 0px;
    margin: 0px;
}
.div-black {
    background-color: #03020d;
    color: #ffffff;
}
.div-black:hover {
    background-color: rgb(47, 216, 157);;
    color: #000000;
}
.back-btn:hover {
    border: none;
    background: none;
    color: #ffffff;
}
.orange-txt {
    color: #ff5416;
}
</style>
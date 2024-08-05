import HostView from './components/host/HostView.vue'
import PlayerView from './components/player/PlayerView.vue'

export const routes = [
    { path: '', component: HostView },
    { path: '/play', component: PlayerView }
];

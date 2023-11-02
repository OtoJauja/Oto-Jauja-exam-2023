<template>
    <div id="songs-view" @scroll="handleScroll">
    <div class="wrapper-header">
        <h1>SONGS</h1>
        <div class="wrapper-search">
            <input id="input-search" placeholder="Search by title..." />
        </div>
        <div class="wrapper-settings">
            <button id="btn-show-favorites">Show Favorites</button>
        </div>
    </div>
    <div class="wrapper-songs">
        <table cellspacing="0" cellpadding="0">
            <tr ref="header">
                <th id="th-id" >#</th>
                <th id="th-title">
                    Title
                    <IconCaretUp />
                </th>
                <th id="th-artist">Artist</th>
                <th id="th-album">Album</th>
                <th id="th-duration">
                    Duration
                    <IconCaretUp />
                </th>
            </tr>
            <!-- Loop goes on this <tr> element -->
            <tr class="song">
                <td id="td-index">
                    <IconPlay />
                    <span id="txt-index">1</span>
                </td>
                <td id="td-title">
                    <img src="https://i.scdn.co/image/ab67616d00001e02980c9d288a180838cd12ad24" />
                    DEEP (feat. Nonô)
                </td>
                <td id="td-artist">Example, Bou, Nonô</td>
                <td id="td-album">We May Grow Old But We Never Grow Up</td>
                <td id="td-duration">
                    3:07
                    <IconHeart />
                </td>
            </tr>
        </table>
    </div>
</div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import songsAPI from '../data/songs';
import IconPlay from '../components/icons/IconPlay.vue';
import IconCaretUp from '../components/icons/IconCaretUp.vue';
import IconHeart from '../components/icons/IconHeart.vue';

export default {
    components: { IconPlay, IconCaretUp, IconHeart },
    data() {
        return {
            useAuthStore,
            usePlayerStore,
            songs: [...songsAPI],
            sort: {
                by: null,
                order: 'asc'
            },
            search: '',
            clicks: 0,
            show_favorites: false,
        }
    },
    methods: {
        handleScroll(event) {
            this.$refs.header.classList.value = event.target.scrollTop > 100 ? 'scrolled' : '';
        },
    computed: {
        
    },
}
}
</script>

<template>
    <div id="songs-view" @scroll="handleScroll">
        <div class="wrapper-header">
            <h1>SONGS</h1>
            <div class="wrapper-search">
                <input id="input-search" placeholder="Search by title..." v-model="search" />
            </div>
            <div class="wrapper-settings">
                <button id="btn-show-favorites" :class="{ active: show_favorites }"
                    @click="show_favorites = !show_favorites">Show Favorites
                </button>
            </div>
        </div>
        <div class="wrapper-songs">
            <table cellspacing="0" cellpadding="0">
                <tr ref="header">
                    <th id="th-id">#</th>
                    <th id="th-title" @click="sortBy('title')" :class="{ active: sort.by === 'title'}">
                        Title
                        <IconCaretUp v-if="sort.by === 'title'" :class="{ 'flip-vertical': sort.order === 'desc'}" />
                    </th>
                    <th id="th-artist">Artist</th>
                    <th id="th-album">Album</th>
                    <th id="th-duration" @click="sortBy('duration')" :class="{active: sort.by === 'duration' }">
                        Duration
                        <IconCaretUp v-if="sort.by === 'duration'" :class="{'flip-vertical': sort.order === 'desc'}" />
                    </th>
                </tr>
                <!-- Loop goes on this <tr> element -->
                <tr class="song" v-for="(song, index) in filtered_songs" :key="song.id" @click="selectSong(song)" 
                :class="{ active: player.now_playing_song_id === song.id }">
                    <td id="td-index">
                        <IconPlay v-if="player.now_playing_song_id === song.id"/>
                        <span v-else id="txt-index">{{ index + 1 }}</span>
                    </td>
                    <td id="td-title">
                        <img :src="song.album.images[1].url" />
                        {{ song.name }}
                    </td>
                    <td id="td-artist">{{ getArtists(song.artists) }}</td>
                    <td id="td-album">{{ song.album.name }}</td>
                    <td id="td-duration">
                        {{ getTime(song.duration_ms) }}
                        <IconHeart :class="{ active: useAuthStore.getFavoriteSongs().includes(song.id) }" @click="useAuthStore.toggleFavorite(song.id)"/>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { usePlayerStore } from '@/stores/player';
import songsAPI from '../data/songs';
import IconPlay from '../components/icons/IconPlay.vue';
import IconCaretUp from '../components/icons/IconCaretUp.vue';
import IconHeart from '../components/icons/IconHeart.vue';

export default {
    components: { 
        IconPlay, 
        IconCaretUp, 
        IconHeart 
    },
    data() {
        return {
            player: usePlayerStore,
            useAuthStore,
            songs: [...songsAPI],
            sort: {
                by: null,
                order: 'asc'
            },
            search: '',
            click: 0,
            show_favorites: false,
        }
    },
    methods: {
        handleScroll(event) {
            this.$refs.header.classList.value = event.target.scrollTop > 100 ? 'scrolled' : '';
        },
        sortBy(by) {
            if (by === this.sort.by) {
                this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc';
                this.sort.by = this.sort.order === 'asc' ? null : this.sort.by;
            } else {
                this.sort.by = by;
            }
            switch (this.sort.by) {
                case 'title':
                    this.songs.sort((a, b) => {
                        if (this.sort.order === 'asc') {
                            if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
                            if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
                        } else {
                            if (b.name.toLowerCase() < a.name.toLowerCase()) { return -1; }
                            if (b.name.toLowerCase() > a.name.toLowerCase()) { return 1; }
                        }
                        return 0;
                    });
                    break;
                case 'duration':
                    this.songs.sort((a, b) => {
                        if (this.sort.order === 'asc') {
                            if (a.duration_ms < b.duration_ms) { return -1; }
                            if (a.duration_ms > b.duration_ms) { return 1; }
                        } else {
                            if (b.duration_ms < a.duration_ms) { return -1; }
                            if (b.duration_ms > a.duration_ms) { return 1; }
                        }
                        return 0;
                    });
                    break;
                default:
                    this.songs = [...songsAPI];
                    break;
            }
        },
        selectSong(song) {
            const player = usePlayerStore();
            this.click++;
            if (this.click === 1) {
                this.timer = setTimeout(() => {
                    this.click = 0;
                }, 500);
            } else {
                clearTimeout(this.timer);
                player.setNowPlaying(song);
                this.click = 0;
            }
        },
        getArtists(artists) {
            return artists.map(artist => artist.name).join(', ');
        },
        getTime(duration_ms) {
            let minutes = Math.floor(duration_ms / (1000 * 60));
            let seconds = Math.floor((duration_ms % (1000 * 60)) / 1000);
            const time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            return time;
        },
    },
    computed: {
        ...mapState(usePlayerStore, {
            now_playing           : "getNowPlaying",
            now_playing_song_id   : "getNowPlayingSongId",
            song_preview          : "getNowPlayingSongPreview",
            now_playing_song_image: "getNowPlayingSongImage",
            now_playing_song_name : "getNowPlayingSongName",
            now_playing_artists   : "getNowPlayingArtists",
            next_song             : "getNextSong",
            previous_song         : "getPreviousSong",
        }),
        filtered_songs() {
            return this.songs.filter(song => {
                let valid = song.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
                if (valid && this.show_favorites) {
                    valid = useAuthStore.getFavoriteSongs().includes(song.id);
                }
                return valid;
            });
        }
    },
}
</script>

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
                    <th id="th-title" @click="sortBy('title')" :class="{ active: sort.by === 'title' }">
                        Title
                        <IconCaretUp v-if="sort.by === 'title'" :class="{ 'flip-vertical': sort.order === 'desc' }" />
                    </th>
                    <th id="th-artist">Artist</th>
                    <th id="th-album">Album</th>
                    <th id="th-duration" @click="sortBy('duration')" :class="{ active: sort.by === 'duration' }">
                        Duration
                        <IconCaretUp v-if="sort.by === 'duration'" :class="{ 'flip-vertical': sort.order === 'desc' }" />
                    </th>
                </tr>
                <!-- Loop goes on this <tr> element -->
                <tr class="song" v-for="(song, index) in filtered_songs" :key="song.id" @click="selectSong(song)"
                    :class="{ active: isNowPlaying(song) }">
                    <td id="td-index">
                        <IconPlay v-if="isNowPlaying(song)" color="var(--c-accent)" />
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
                        <IconHeart :class="{ active: useAuthStore.getFavoriteSongs().includes(song.id) }"
                            @click="useAuthStore.toggleFavorite(song.id)" />
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
            } else {
                this.sort.by = by;
            }
            this.songs.sort((a, b) => {
                switch (this.sort.by) {
                    case 'title':
                        if (this.sort.order === 'asc') {
                            return a.name.localeCompare(b.name);
                        } else {
                            return b.name.localeCompare(a.name);
                        }
                    case 'duration':
                        if (this.sort.order === 'asc') {
                            return a.duration_ms - b.duration_ms;
                        } else {
                            return b.duration_ms - a.duration_ms;
                        }
                    default:
                        return 0;
                }
            });
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
        filtered_songs() {
            return this.songs.filter(song => {
                let valid = song.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
                if (valid && this.show_favorites) {
                    valid = useAuthStore.getFavoriteSongs().includes(song.id);
                }
                return valid;
            });
        },
        isNowPlaying() {
            const player = usePlayerStore();
            return (song) => song.id === player.getNowPlayingSongId;
        }
    },
}
</script>

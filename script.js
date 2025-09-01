        const accessToken = 'BQDsoXeNV-Z8P7-Zz2cMXxMwoCJpuONuwPEwnOH9ZORL2UpRaS2GQVlByJXPJW-tfdvsHfMNwABRKUg_CAWcLQoXjgTwSlv9NP6LIEYw4njkSKjI7evNGAAZJEqLci7Sbi8VBDLn1DXW4UpRdaj5H6htKIU45aGBrgIpvEim-PHj53V8OSNyMiWRJme_kzM42PWOENB0EkUWS6T3f-7QwbyZk77RnA1vPDBAEwyPv1_2Ag2K31WePrjvciLf_lSXL6GLKzUmEjZN3s1pwc4XUHTwNGNl59vkOAn8KHUtn0U8PVY5YC8A4KZTR-09_8sG';  // Replace with a valid Spotify Access Token
        let trackOffset = 0;
        let playlistOffset = 0;

        function searchSpotify() {
            const query = document.getElementById('searchQuery').value;
            if (query.trim() === '') return;

            // Hide load more buttons initially
            document.getElementById('loadMoreTracks').classList.add('hidden');
            document.getElementById('loadMorePlaylists').classList.add('hidden');

            console.log("Searching for:", query);

            // Fetch initial results
            fetchResults(query, 0, 0, 6, 6);
        }

        function fetchResults(query, trackOffset, playlistOffset, trackLimit, playlistLimit) {
            // Fetch tracks
            fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&offset=${trackOffset}&limit=${trackLimit}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Tracks data:", data); // Debug log
                const trackResultsDiv = document.getElementById('trackResults');
                const tracks = data.tracks.items;

                if (trackOffset === 0) {
                    trackResultsDiv.innerHTML = '';
                }

                tracks.forEach(track => {
                    const trackDiv = document.createElement('div');
                    trackDiv.className = 'track';
                    
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://open.spotify.com/embed/track/${track.id}`;
                    iframe.width = "300";
                    iframe.height = "80"; // Default height
                    iframe.frameBorder = "0";
                    iframe.allow = "encrypted-media";
                    trackDiv.appendChild(iframe);
                    
                    trackResultsDiv.appendChild(trackDiv);
                });

                // Show load more button if there are more tracks
                if (data.tracks.next) {
                    document.getElementById('loadMoreTracks').classList.remove('hidden');
                }

                // Store the offset for the next page of tracks
                window.trackOffset = trackOffset + trackLimit;
            })
            .catch(error => console.error('Error fetching tracks:', error));

            // Fetch playlists
            fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&offset=${playlistOffset}&limit=${playlistLimit}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Playlists data:", data); // Debug log
                const playlistResultsDiv = document.getElementById('playlistResults');
                const playlists = data.playlists.items;

                if (playlistOffset === 0) {
                    playlistResultsDiv.innerHTML = '';
                }

                playlists.forEach(playlist => {
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://open.spotify.com/embed/playlist/${playlist.id}`;
                    iframe.width = "300";
                    iframe.height = "380";
                    iframe.frameBorder = "0";
                    iframe.allow = "encrypted-media";
                    iframe.className = "playlist";
                    playlistResultsDiv.appendChild(iframe);
                });

                // Show load more button if there are more playlists
                if (data.playlists.next) {
                    document.getElementById('loadMorePlaylists').classList.remove('hidden');
                }

                // Store the offset for the next page of playlists
                window.playlistOffset = playlistOffset + playlistLimit;
            })
            .catch(error => console.error('Error fetching playlists:', error));
        }

        function loadMoreTracks() {
            const query = document.getElementById('searchQuery').value;
            fetchResults(query, window.trackOffset, window.playlistOffset, 3, 0);
        }

        function loadMorePlaylists() {
            const query = document.getElementById('searchQuery').value;
            fetchResults(query, window.trackOffset, window.playlistOffset, 0, 3);
        }

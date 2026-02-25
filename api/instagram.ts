
export const config = {
    runtime: 'edge', // Using edge for faster performance
};

export default async function handler(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return new Response(JSON.stringify({ error: 'Username is required' }), {
            status: 400,
            headers: { 'content-type': 'application/json' },
        });
    }

    try {
        const targetUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'X-IG-App-ID': '936619743392459',
                'Referer': `https://www.instagram.com/${username}/`,
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        if (response.ok) {
            const data = await response.json();
            const user = data.data.user;
            if (user) {
                return new Response(JSON.stringify({
                    followers: user.edge_followed_by.count,
                    following: user.edge_follow.count,
                    posts: user.edge_owner_to_timeline_media.count,
                }), {
                    headers: { 'content-type': 'application/json' },
                });
            }
        }

        // Fallback data if Instagram blocks the request
        return new Response(JSON.stringify({
            followers: 4290,
            following: 172,
            posts: 298,
            isFallback: true
        }), {
            headers: { 'content-type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}

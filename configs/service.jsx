import axios from 'axios';

const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';

const getVideos = async (query) => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn('YouTube API key is not configured');
    return [];
  }

  try {
    const resp = await axios.get(YOUTUBE_BASE_URL + '/search', {
      params: {
        part: 'snippet',
        q: query,
        maxResults: 1,
        type: 'video',
        videoEmbeddable: true,
        key: apiKey,
      },
    });

    return resp.data.items || [];
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.error?.message || err.message;

    if (status === 403) {
      console.warn('YouTube API quota exceeded or key restricted:', message);
    } else if (status === 400) {
      console.warn('YouTube API bad request:', message);
    } else {
      console.warn('YouTube API error:', status, message);
    }

    return [];
  }
};

export default { getVideos };

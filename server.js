// gnews.io endpoint: https://gnews.io/api/v4/top-headlines?category=general&apikey=e1f9e739bc96f6ffcbf7644e81416d39

require('dotenv').config();
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

const apiUrl = 'https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=' + process.env.NEWS_API_KEY;

const supabaseUrl = 'https://gvrsgbnsnuuzmwfxtnho.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const fetchNews = async() => {
    try {
        const response = await axios.get(apiUrl);
        return response.data.articles;
    } catch (error) {
        console.error('Error fetching news data:', error);
    }
}

const uploadToSupabase = async(articles) => {
    try {
        const { data, error } = await supabase
            .from('News')
            .insert(articles.map(article => ({
                title: article.title,
                description: article.description,
                content: article.content,
                url: article.url,
                image: article.image,
                publishedAt: article.publishedAt,
            })));

            if (error) throw error;
            console.log('Successfully inserted data:', data);
    } catch (error) {
        console.error('Error uploading to database:', error);
    }
}

const fetchFromSupabases = async() => {
    try {
        const { data, error } = await supabase
            .from('News')
            .select('*');

            if (error) throw error;
            console.log('Successfully fetched data from Supabase:', data);
    } catch (error) {
        console.error('Error fetching data from Supabase:', error);
    }
}

const main = async() => {
    // const articles = await fetchNews();
    const articles = await fetchFromSupabases();

    if (articles.length > 0) {
        await uploadToSupabase(articles);
    } else {
        console.log("No articles available!");
    }
}

main();
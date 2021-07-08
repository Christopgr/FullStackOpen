const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0
        ? 0
        : blogs.reduce(reducer, 0)

}

const favoriteBlog = (blogs) => {
    const reducer = (favorite, item) => {
        if (item.likes > favorite.likes) {
            return item
        } else {
            return favorite
        }
    }

    return blogs.reduce(reducer, blogs[0])

}

const mostBlogs = (blogs) => {

    const reducer = (mostBloged, item) => {

        const blogList = blogs.filter(blog => blog.author === item.author)

        if (blogList.length > mostBloged.blogs) {
            return {
                author: blogList[0].author,
                blogs: blogList.length
            }
        } else {
            return mostBloged
        }


    }

    return blogs.reduce(reducer, {
        author: '',
        blogs: 0
    })

}

const mostLikes = (blogs) => {

    const reducer = (mostLiked, item) => {

        const blogList = blogs.filter(blog => blog.author === item.author)

        const blogListLikes = blogList.reduce((a, b) => a + b.likes, 0)

        if (blogListLikes > mostLiked.likes) {
            return {
                author: blogList[0].author,
                likes: blogListLikes
            }
        } else {
            return mostLiked
        }
    }

    return blogs.reduce(reducer, {
        author: '',
        likes: 0
    })

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
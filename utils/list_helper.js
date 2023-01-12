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
    const author = blogs.reduce((previous, current) => {
        return previous.likes > current.likes ? previous : current
    })
    return {
        title: author.title,
        author: author.author,
        likes: author.likes
    }
}

const mostBlogs = (blogs) => {
    const numOfAuthors = lodash.countBy(blogs, "author")
    const author = Object.keys(numOfAuthors).reduce((curr, next) => {
        return numOfAuthors[curr] > numOfAuthors[next] ? curr : next
    })
    return {
        author: author,
        blogs: numOfAuthors[author]
    }
}

const mostLikes = (blogs) => {
    const numOfLikes = lodash(blogs)
    .groupBy("author")
    .map((obj, key) => ({
        author: key,
        likes: lodash.sumBy(obj, "likes")
    })).value()
    return numOfLikes.reduce((curr, next) => {
        return curr.likes > next.likes ? curr : next
    })
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
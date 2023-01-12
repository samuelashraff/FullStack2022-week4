const listHelper = require('../utils/list_helper')
const bloglistHelper = require("./bloglist_helper")

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {  
    test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(bloglistHelper.listWithOneBlog)
      expect(result).toBe(5)
    })
})

describe('Favorite blogs', () => {
    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.favoriteBlog(bloglistHelper.listWithOneBlog)
        const expected = {
            title: "test",
            author: "author",
            likes: 2
        }
        expect(result).toBe(expected)
    })

    test('when list has many blogs', () => {
        const result = listHelper.favoriteBlog(bloglistHelper.listWithManyBlogs)
        const expected = {
            title: "test2",
            author: "author2",
            likes: 3
        }
        expect(result).toBe(expected)
    })
})

describe("most blogs", () => {
  
    test("when list has one blog, mostBlogs() returns that blog", () => {
      const result = listHelper.mostBlogs(bloglistHelper.listWithOneBlog)
      const expected = {
        author: "Author",
        blogs: 1 
      }
      expect(result).toEqual(expected)
    })
  
    test("when list has many blogs, returns author2", () => {
      const result = listHelper.mostBlogs(bloglistHelper.listWithManyBlogs)
      const expected = {
        author: "author2",
        blogs: 3
      }
      expect(result).toEqual(expected)
    })
})

describe("most likes", () => {
    test("when list has one blog, mostLikes() returns that blog", () => {
        const result = listHelper.mostLikes(bloglistHelper.listWithOneBlog)
        const expected = {
            author: "author2",
            likes: 3
        }
        expect(result).toEqual(expected)
    })
    test("when list has many blogs, returns blog with author2", () => {
        const result = listHelper.mostLikes(bloglistHelper.listWithManyBlogs)
        const expected = {
            author: "author2",
            likes: 3
        }
    })
})
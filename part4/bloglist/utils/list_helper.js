const dummy = (blogs) => {
  // ....

  return 1;
};

const totalLikes = (blogs) => {
  let numOfLikes = blogs.reduce((a, b) => a + b.likes, 0);

  return numOfLikes;
};

const favoriteBlog = (blogs) => {
  let mostLiked = blogs.reduce((a, b) => (a.likes > b.likes ? a : b));
  return {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes
  };
};

const mostBlogs = (blogs) => {
  let authorList = [];
  blogs.forEach((x) => {
    const authorOnList = authorList.find((y) => y.author === x.author);
    if (authorOnList) {
      authorOnList.blogs += 1;
    } else {
      authorList = authorList.concat({ author: x.author, blogs: 1 });
    }
  });
  const topAuthor = authorList.reduce((a, b) => (a.blogs > b.blogs ? a : b));
  return { author: topAuthor.author, blogs: topAuthor.blogs };
};

const mostLikes = (blogs) => {
  let authorList = [];
  blogs.forEach((x) => {
    const authorOnList = authorList.find((y) => y.author === x.author);
    if (authorOnList) {
      authorOnList.likes += x.likes;
    } else {
      authorList = authorList.concat({ author: x.author, likes: x.likes });
    }
  });
  const topAuthor = authorList.reduce((a, b) => (a.likes > b.likes ? a : b));
  return { author: topAuthor.author, likes: topAuthor.likes };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };

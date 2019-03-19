export default filter => {
  switch (filter) {
      case "Likes count":
          return "likesCount";
      case "Dislikes count":
          return "dislikesCount";
      case "Comments count":
          return "commentsCount";
      case "Favourites count":
          return "favouritesCount";
      case "Views count":
          return "viewsCount";
      case "Referrals count":
          return "referralCount";
      case "Last online":
          return "lastVisited";
      case "None":
          return "userId";
  }
};